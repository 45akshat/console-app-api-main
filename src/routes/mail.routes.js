const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: 'info@consolegaming.in', // Your email address
    pass: 'rdvx znri pknd xjqj',
  },
});

router.post('/send', async (req, res) => {
  const { name, email, phone, note } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
  }

  const mailOptions = {
    from: 'info@consolegaming.in',
    to: "franchise@consolegaming.in",
    subject: 'New Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nNote: ${note}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Failed to send email: ${error.message}` });
  }
});

module.exports = router;
