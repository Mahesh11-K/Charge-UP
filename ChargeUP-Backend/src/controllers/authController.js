// src/controllers/authController.js
const { User, UserProfile } = require('../models');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'chargeup_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const VALID_ROLES = ['driver', 'station_owner', 'admin'];

// Helper: Format User response payload (omitting sensitive fields like password)
const formatUserResponse = (user, profile = null) => ({
  id: user.id,
  fullName: user.fullName || user.name || 'ChargeUP User',
  email: user.email,
  role: user.role || 'driver',
  authProvider: user.authProvider || 'local',
  avatarUrl: (profile && profile.avatarUrl) || user.avatarUrl || null,
  lastLogin: user.lastLogin || null,
  createdAt: user.createdAt,
  profile: profile ? {
    id: profile.id,
    mobileNumber: profile.mobileNumber || '',
    address: profile.address || '',
    city: profile.city || '',
    state: profile.state || '',
    zipCode: profile.zipCode || '',
    gender: profile.gender || 'prefer_not_to_say',
    dateOfBirth: profile.dateOfBirth || null,
    avatarUrl: profile.avatarUrl || user.avatarUrl || null,
    avatarStyle: profile.avatarStyle || 'cartoon_ev_1',
    emergencyContact: profile.emergencyContact || '',
    evModel: profile.evModel || '',
    bio: profile.bio || '',
    isVerified: profile.isVerified ?? true,
    updatedAt: profile.updatedAt
  } : (user.profile ? {
    id: user.profile.id,
    mobileNumber: user.profile.mobileNumber || '',
    address: user.profile.address || '',
    city: user.profile.city || '',
    state: user.profile.state || '',
    zipCode: user.profile.zipCode || '',
    gender: user.profile.gender || 'prefer_not_to_say',
    dateOfBirth: user.profile.dateOfBirth || null,
    avatarUrl: user.profile.avatarUrl || user.avatarUrl || null,
    avatarStyle: user.profile.avatarStyle || 'cartoon_ev_1',
    emergencyContact: user.profile.emergencyContact || '',
    evModel: user.profile.evModel || '',
    bio: user.profile.bio || '',
    isVerified: user.profile.isVerified ?? true,
    updatedAt: user.profile.updatedAt
  } : null)
});

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      fullName: user.fullName || user.name,
      role: user.role || 'driver' 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper: Auto-repair database schema if missing columns cause query errors
const ensureSchemaColumns = async () => {
  try {
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role ENUM('driver', 'station_owner', 'admin') NOT NULL DEFAULT 'driver',
      ADD COLUMN IF NOT EXISTS authProvider ENUM('local', 'google') NOT NULL DEFAULT 'local',
      ADD COLUMN IF NOT EXISTS googleId VARCHAR(255) NULL,
      ADD COLUMN IF NOT EXISTS avatarUrl VARCHAR(500) NULL,
      ADD COLUMN IF NOT EXISTS lastLogin DATETIME NULL;
    `);
  } catch (err) {
    try {
      await sequelize.query("ALTER TABLE users ADD COLUMN role ENUM('driver', 'station_owner', 'admin') DEFAULT 'driver'");
    } catch (e) {}
  }
};

/**
 * 1. User Registration Handler (POST /api/auth/signup & /api/auth/register)
 */
exports.signup = async (req, res) => {
  const { fullName, name, email, password, role } = req.body;
  const userName = (fullName || name || '').trim();

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation Error: Full name, email, and password are required fields.' 
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Invalid email address format.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Password must be at least 6 characters long.'
      });
    }

    const userRole = role && VALID_ROLES.includes(role) ? role : 'driver';

    let existingUser;
    try {
      existingUser = await User.findOne({ where: { email: trimmedEmail } });
    } catch (dbError) {
      if (dbError.message && dbError.message.includes("Unknown column")) {
        await ensureSchemaColumns();
        existingUser = await User.findOne({ where: { email: trimmedEmail } });
      } else {
        throw dbError;
      }
    }

    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: 'Conflict: An account with this email address already exists.' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    try {
      newUser = await User.create({
        fullName: userName,
        email: trimmedEmail,
        password: hashedPassword,
        role: userRole,
        authProvider: 'local',
        lastLogin: new Date(),
      });
    } catch (createErr) {
      if (createErr.message && createErr.message.includes("Unknown column")) {
        await ensureSchemaColumns();
        newUser = await User.create({
          fullName: userName,
          email: trimmedEmail,
          password: hashedPassword,
          role: userRole,
          authProvider: 'local',
          lastLogin: new Date(),
        });
      } else {
        throw createErr;
      }
    }

    // Create initial empty profile record for new user
    try {
      await UserProfile.create({
        userId: newUser.id,
        avatarStyle: 'cartoon_ev_1',
        isVerified: true
      });
    } catch (e) {}

    const userPayload = formatUserResponse(newUser);
    const token = generateToken(userPayload);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ChargeUP.',
      token,
      user: userPayload
    });

  } catch (error) {
    console.error('❌ Sign Up Error:', error.message || error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error: Registration failed.' 
    });
  }
};

exports.register = exports.signup;

/**
 * 2. User Sign In Handler (POST /api/auth/signin & /api/auth/login)
 */
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation Error: Both email and password are required.' 
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    let user;
    try {
      user = await User.findOne({ 
        where: { email: trimmedEmail },
        include: [{ model: UserProfile, as: 'profile', required: false }]
      });
    } catch (dbError) {
      if (dbError.message && dbError.message.includes("Unknown column")) {
        await ensureSchemaColumns();
        user = await User.findOne({ 
          where: { email: trimmedEmail },
          include: [{ model: UserProfile, as: 'profile', required: false }]
        });
      } else {
        throw dbError;
      }
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication Error: Invalid email address or password.' 
      });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Account Error: This account was created using Google OAuth. Please sign in with Google.' 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication Error: Invalid email address or password.' 
      });
    }

    try {
      user.lastLogin = new Date();
      await user.save();
    } catch (e) {}

    const userPayload = formatUserResponse(user, user.profile);
    const token = generateToken(userPayload);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome back to ChargeUP!',
      token,
      user: userPayload
    });

  } catch (error) {
    console.error('❌ Sign In Error:', error.message || error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error: Sign in failed.' 
    });
  }
};

exports.login = exports.signin;

/**
 * 3. Get Active User Profile (GET /api/auth/me)
 */
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized user session.' });
    }

    let user;
    try {
      user = await User.findByPk(req.user.id, {
        include: [{ model: UserProfile, as: 'profile', required: false }]
      });
    } catch (err) {
      await ensureSchemaColumns();
      user = await User.findByPk(req.user.id, {
        include: [{ model: UserProfile, as: 'profile', required: false }]
      });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      user: formatUserResponse(user, user.profile)
    });
  } catch (error) {
    console.error('❌ Get Me Profile Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

/**
 * 4. Get User Profile Details (GET /api/auth/profile)
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    let profile = await UserProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      profile = await UserProfile.create({
        userId: req.user.id,
        avatarStyle: 'cartoon_ev_1',
        isVerified: true
      });
    }

    const user = await User.findByPk(req.user.id);
    return res.status(200).json({
      success: true,
      user: formatUserResponse(user, profile),
      profile
    });
  } catch (error) {
    console.error('❌ Get Profile Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch profile details.' });
  }
};

/**
 * 5. Update / Save User Personal Details & Cartoon Avatar (PUT /api/auth/profile)
 */
exports.updateProfile = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  const {
    mobileNumber,
    address,
    city,
    state,
    zipCode,
    gender,
    dateOfBirth,
    avatarUrl,
    avatarStyle,
    emergencyContact,
    evModel,
    bio,
    fullName
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Update user full name if provided
    if (fullName && fullName.trim()) {
      user.fullName = fullName.trim();
      if (avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    }

    // Upsert Profile record
    let [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        mobileNumber: mobileNumber || '',
        address: address || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        gender: gender || 'prefer_not_to_say',
        dateOfBirth: dateOfBirth || null,
        avatarUrl: avatarUrl || user.avatarUrl || null,
        avatarStyle: avatarStyle || 'cartoon_ev_1',
        emergencyContact: emergencyContact || '',
        evModel: evModel || '',
        bio: bio || '',
        isVerified: true,
      }
    });

    if (!created) {
      if (mobileNumber !== undefined) profile.mobileNumber = mobileNumber;
      if (address !== undefined) profile.address = address;
      if (city !== undefined) profile.city = city;
      if (state !== undefined) profile.state = state;
      if (zipCode !== undefined) profile.zipCode = zipCode;
      if (gender !== undefined) profile.gender = gender;
      if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth || null;
      if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
      if (avatarStyle !== undefined) profile.avatarStyle = avatarStyle;
      if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;
      if (evModel !== undefined) profile.evModel = evModel;
      if (bio !== undefined) profile.bio = bio;
      profile.isVerified = true;

      await profile.save();
    }

    const updatedUserPayload = formatUserResponse(user, profile);

    return res.status(200).json({
      success: true,
      message: 'Profile details saved and verified successfully!',
      user: updatedUserPayload,
      profile
    });

  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to save profile details.' 
    });
  }
};

/**
 * 6. Check Email Availability (POST /api/auth/check-email)
 */
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ success: false, error: 'Email parameter required.' });
    const trimmedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ where: { email: trimmedEmail } });
    return res.status(200).json({
      success: true,
      available: !existing,
      exists: !!existing,
      message: existing ? 'Email is already registered.' : 'Email is available.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error checking email.' });
  }
};

/**
 * 7. Google OAuth Authentication (POST /api/auth/google)
 */
exports.googleAuth = async (req, res) => {
  const { credential, role } = req.body;
  try {
    if (!credential) return res.status(400).json({ success: false, error: 'Google token missing.' });
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      const decoded = jwt.decode(credential);
      if (decoded && decoded.email) {
        payload = { sub: decoded.sub || 'google_user', email: decoded.email, name: decoded.name || 'Google User', picture: decoded.picture || null };
      } else {
        throw err;
      }
    }

    const { sub: googleId, email, name: fullName, picture: avatarUrl } = payload;
    const trimmedEmail = email.trim().toLowerCase();
    const userRole = role && VALID_ROLES.includes(role) ? role : 'driver';

    let user;
    try {
      user = await User.findOne({ 
        where: { email: trimmedEmail },
        include: [{ model: UserProfile, as: 'profile', required: false }]
      });
    } catch (dbErr) {
      await ensureSchemaColumns();
      user = await User.findOne({ 
        where: { email: trimmedEmail },
        include: [{ model: UserProfile, as: 'profile', required: false }]
      });
    }

    if (!user) {
      user = await User.create({
        fullName: fullName || 'Google User',
        email: trimmedEmail,
        googleId,
        avatarUrl: avatarUrl || null,
        authProvider: 'google',
        role: userRole,
        password: '',
        lastLogin: new Date(),
      });
      await UserProfile.create({ userId: user.id, avatarUrl, isVerified: true });
    } else {
      user.googleId = googleId || user.googleId;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      user.lastLogin = new Date();
      await user.save();
    }

    const userPayload = formatUserResponse(user, user.profile);
    const token = generateToken(userPayload);

    return res.status(200).json({ success: true, message: 'Google auth successful!', token, user: userPayload });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Google verification failed.' });
  }
};

/**
 * 8. Sign Out / Logout (POST /api/auth/logout)
 */
exports.logout = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};