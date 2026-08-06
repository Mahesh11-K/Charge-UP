const { Station } = require('../models');

const DUBLIN_INITIAL_SEEDS = [
  { stationCode: "IRL-DUB-201", name: "Grand Canal Dock Rapid Charging Hub", city: "Dublin 2", kwSpeed: "150 kW", connectors: "CCS / CHAdeMO", status: "Available", lat: 53.3438, lng: -6.2398, pricePerKwh: 0.45 },
  { stationCode: "IRL-DUB-202", name: "Grafton Street Mall Charging Station", city: "Dublin 2", kwSpeed: "50 kW", connectors: "Type 2 / CCS", status: "Available", lat: 53.3412, lng: -6.2598, pricePerKwh: 0.40 },
  { stationCode: "IRL-DUB-203", name: "Red Cow Interchange Supercharger", city: "Dublin 22", kwSpeed: "350 kW", connectors: "CCS", status: "Available", lat: 53.3175, lng: -6.3712, pricePerKwh: 0.50 },
  { stationCode: "IRL-DUB-204", name: "Ballsbridge Herbert Park EV Point", city: "Dublin 4", kwSpeed: "22 kW", connectors: "Type 2", status: "Occupied", lat: 53.3283, lng: -6.2291, pricePerKwh: 0.35 },
  { stationCode: "IRL-DUB-205", name: "Dundrum Town Centre Fast Charger", city: "Dublin 14", kwSpeed: "150 kW", connectors: "CCS / CHAdeMO", status: "Available", lat: 53.2878, lng: -6.2415, pricePerKwh: 0.45 },
  { stationCode: "IRL-DUB-206", name: "Blanchardstown Shopping Hub", city: "Dublin 15", kwSpeed: "220 kW", connectors: "CCS", status: "Available", lat: 53.3922, lng: -6.3888, pricePerKwh: 0.48 },
  { stationCode: "IRL-DUB-207", name: "Dublin Airport T2 Express Station", city: "Co. Dublin", kwSpeed: "350 kW", connectors: "CCS / CHAdeMO", status: "Available", lat: 53.4264, lng: -6.2499, pricePerKwh: 0.52 },
  { stationCode: "IRL-DUB-208", name: "Phoenix Park Gate Charging Point", city: "Dublin 8", kwSpeed: "50 kW", connectors: "Type 2", status: "Occupied", lat: 53.3512, lng: -6.2911, pricePerKwh: 0.38 },
  { stationCode: "IRL-DUB-209", name: "Sandyford Business Park Hub", city: "Dublin 18", kwSpeed: "150 kW", connectors: "CCS", status: "Available", lat: 53.2778, lng: -6.2081, pricePerKwh: 0.45 }
];

const seedStationsIfEmpty = async () => {
  const count = await Station.count();
  if (count === 0) {
    await Station.bulkCreate(DUBLIN_INITIAL_SEEDS);
    console.log('⚡ Dublin EV Charging Stations seeded into MySQL!');
  }
};

exports.getAllStations = async (req, res) => {
  try {
    await seedStationsIfEmpty();
    const stations = await Station.findAll();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStation = async (req, res) => {
  try {
    const { stationCode, name, city, kwSpeed, connectors, status, lat, lng, pricePerKwh } = req.body;

    const existingStation = await Station.findOne({ where: { stationCode } });
    if (existingStation) {
      return res.status(400).json({ error: 'Station code already registered.' });
    }

    const station = await Station.create({
      stationCode,
      name,
      city,
      kwSpeed,
      connectors,
      status: status || 'Available',
      lat,
      lng,
      pricePerKwh: pricePerKwh || 0.45,
      operatorId: req.user ? req.user.id : null
    });

    res.status(201).json({ message: 'Station created successfully', station });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};