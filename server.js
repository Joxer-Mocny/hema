const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const peopleRoutes = require('./routes/people');
const registrationRoutes = require('./routes/registration'); 
const eventRoutes = require('./routes/events'); 
const adminRoutes = require('./routes/admin');

const app = express();


app.use(express.json());


app.use(express.static('public'));


app.use('/people', peopleRoutes);
app.use('/registrations', registrationRoutes); 
app.use('/events', eventRoutes);
app.use('/admin', adminRoutes); 


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Server is running at http://localhost:${PORT}`);
});
