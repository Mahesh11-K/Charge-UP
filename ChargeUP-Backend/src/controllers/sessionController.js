const { ChargingSession, Station, User, sequelize } = require('../models');

/**
 * ⚡ Start a new EV Charging Session
 * POST /api/sessions/start
 */
exports.startSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { stationId, chargingRateKw = 7.4 } = req.body;
    const userId = req.user.id;

    const station = await Station.findByPk(stationId, { transaction });
    if (!station) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Charging station not found.' });
    }

    if (station.status !== 'Available') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Station is currently occupied or offline.' });
    }

    // Mark station as occupied
    station.status = 'Occupied';
    await station.save({ transaction });

    // Create new charging session
    const session = await ChargingSession.create({
      userId,
      stationId,
      chargingRateKw: Number(chargingRateKw),
      status: 'IN_PROGRESS',
      startTime: new Date()
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({
      message: 'EV Charging session started successfully',
      session
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

/**
 * 🛑 Stop Active Session & Process Payment
 * POST /api/sessions/stop
 */
exports.stopSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await ChargingSession.findByPk(sessionId, {
      include: [Station, User],
      transaction
    });

    if (!session || session.status !== 'IN_PROGRESS') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Active charging session not found.' });
    }

    // Verify session belongs to user (or user is admin)
    if (session.userId !== userId && req.user.role !== 'ADMIN') {
      await transaction.rollback();
      return res.status(403).json({ error: 'Unauthorized to stop this session.' });
    }

    const pricePerKwh = parseFloat(session.Station?.pricePerKwh || 0.35);
    const kwhDelivered = parseFloat(session.energyConsumedKwh || 0);
    const totalCost = Number((kwhDelivered * pricePerKwh).toFixed(2));
    const carbonSavedKg = Number((kwhDelivered * 0.42).toFixed(2)); // ~0.42kg CO2 saved per kWh vs fossil fuel

    session.endTime = new Date();
    session.status = 'COMPLETED';
    session.totalCost = totalCost;
    session.carbonSavedKg = carbonSavedKg;
    await session.save({ transaction });

    // Deduct user wallet balance
    const user = await User.findByPk(session.userId, { transaction });
    if (user) {
      user.walletBalance = Number((parseFloat(user.walletBalance || 0) - totalCost).toFixed(2));
      await user.save({ transaction });
    }

    // Restore station status to Available
    const station = await Station.findByPk(session.stationId, { transaction });
    if (station) {
      station.status = 'Available';
      await station.save({ transaction });
    }

    await transaction.commit();

    return res.json({
      message: 'Charging session stopped and billed successfully',
      session
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ⚡ Live Telemetry Update
 * POST /api/sessions/telemetry
 */
exports.updateTelemetry = async (req, res) => {
  try {
    const { sessionId, energyConsumedKwh, chargingRateKw, currentAmps } = req.body;

    const session = await ChargingSession.findByPk(sessionId);
    if (!session || session.status !== 'IN_PROGRESS') {
      return res.status(404).json({ error: 'Active session not found.' });
    }

    if (energyConsumedKwh !== undefined) session.energyConsumedKwh = Number(energyConsumedKwh);
    if (chargingRateKw !== undefined) session.chargingRateKw = Number(chargingRateKw);
    if (currentAmps !== undefined) session.currentAmps = Number(currentAmps);
    
    // Estimate carbon saved in real time
    session.carbonSavedKg = Number(((session.energyConsumedKwh || 0) * 0.42).toFixed(2));

    await session.save();

    return res.json({
      message: 'Telemetry updated successfully',
      session
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * 🔍 Get Active Session for Driver
 * GET /api/sessions/active
 */
exports.getActiveSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeSession = await ChargingSession.findOne({
      where: { userId, status: 'IN_PROGRESS' },
      include: [{ model: Station }]
    });

    return res.json({ activeSession });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * 📜 Get User Session History
 * GET /api/sessions/history
 */
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await ChargingSession.findAll({
      where: { userId },
      include: [{ model: Station }],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      count: sessions.length,
      sessions
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};