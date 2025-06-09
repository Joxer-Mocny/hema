const express = require('express');
const router = express.Router();
const Person = require('../models/Person');


router.get('/', async (req, res) => {
  try {
    const people = await Person.find().sort({ name: 1 }); // zoradené abecedne
    res.json(people);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Chyba servera pri načítaní mien' });
  }
});


router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Meno je povinné' });
  }

  const trimmedName = name.trim();

  try {
    const existing = await Person.findOne({ name: trimmedName });

    if (existing) {
      return res.status(200).json({
        message: 'Používateľ už existuje',
        existing: true
      });
    }

    const newPerson = new Person({ name: trimmedName });
    await newPerson.save();

    res.status(201).json({
      message: 'Nový používateľ pridaný',
      existing: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Chyba servera pri ukladaní' });
  }
});

module.exports = router;
