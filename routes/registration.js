const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const sendEmail = require('../utils/mailer'); 

// POST /registrations
router.post('/', async (req, res) => {
  const { name, eventId } = req.body;

  // Basic input validation
  if (!name || !eventId) {
    return res.status(400).json({ message: 'Missing name or eventId' });
  }

  try {
    // Load event from DB
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure array of attendees exists
    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }

    // Avoid duplicate registrations
    if (event.attendees.includes(name)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    // Add user and save
    event.attendees.push(name);
    await event.save();

    // Send e-mail to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🛡️ ${name} registered for ${event.name}`,
      textContent:
        `${name} has just registered for:\n` +
        `${event.name}\n` +
        `Date: ${new Date(event.date).toLocaleDateString()}\n` +
        `Location: ${event.location || 'Unknown'}`
    });

    res.json({ message: 'Registered and e-mail sent' });
  } catch (err) {
    console.error('❌ Error in /registrations:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
