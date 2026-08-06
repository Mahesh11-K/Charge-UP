// routes/stationRoutes.js or controllers/stationController.js
const express = require('express');
const router = express.Router();

// Import the models from your index file where relationships were set up
const { Station, User } = require('../models'); 

// GET /api/stations/:id
router.get('/stations/:id', async (req, res) => {
  try {
    const stationId = req.params.id;

    // Fetch the station and join the Operator (User) data
    const station = await Station.findByPk(stationId, {
      include: [
        { 
          model: User, 
          as: 'operator',
          attributes: ['id', 'name', 'email'] // Best practice: exclude sensitive data like passwords
        }
      ]
    });

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Send the combined JSON response back to the client/frontend
    res.json(station);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;