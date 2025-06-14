const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        return res.json({ success: true });
    } else {
        return res.status(401).json({ success: false, message: 'Wrong password' });
    }
});

module.exports = router; 
