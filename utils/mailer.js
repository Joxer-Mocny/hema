const axios = require('axios');
require('dotenv').config();

/**
 * Sends an email using Brevo (Sendinblue) API
 * 
 * @param {Object} options
 * @param {string} options.to - recipient email
 * @param {string} options.subject - email subject
 * @param {string} options.textContent - plain text message
 */
async function sendEmail({ to, subject, textContent }) {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'HEMA Bot',
          email: process.env.EMAIL_FROM
        },
        to: [{ email: to }],
        subject,
        textContent
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📧 Email sent:', response.data.messageId || response.data);
  } catch (error) {
    console.error('❌ Failed to send email:', error.response?.data || error.message);
  }
}

module.exports = sendEmail;
