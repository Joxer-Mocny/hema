
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// POST /registrations
router.post('/', async (req, res) => {
  const { name, eventId } = req.body;

  if (!name || !eventId) {
    return res.status(400).json({ message: 'Missing name or eventId' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure attendees field exists
    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }

    if (event.attendees.includes(name)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.attendees.push(name);
    await event.save();

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('❌ Error in /registrations:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
