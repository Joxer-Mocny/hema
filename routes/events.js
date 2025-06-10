const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /events - return all events sorted by date
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('❌ Error loading events:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
