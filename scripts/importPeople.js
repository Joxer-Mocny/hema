const fs = require('fs');
const path =require ('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Person = require('../models/Person');
require('dotenv').config();
console.log('MONGODB_URI =', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ Error while connecting MongoDB:', err));

const results = [];

fs.createReadStream(path.join(__dirname, '../data/jiri.csv'))
.pipe(csv())
.on('data', (data) => results.push(data))
.on('end', async () => {
    for (const person of results) {
      try {
        await Person.findOneAndUpdate(
          { name: person.name.trim() },
          { name: person.name.trim() },
          { upsert: true, new: true }
        );
        console.log(`✔️ Added: ${person.name}`);
      } catch (err) {
        console.error(`❌ Error while putting ${person.name}:`, err.message);
      }
    }
    mongoose.disconnect();
    console.log('✅ Import finished');
    
});