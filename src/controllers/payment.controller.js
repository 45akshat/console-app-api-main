const PaymentService = require('../services/payment.service');
const UserService = require('../services/user.service'); // Import UserService
const nodemailer = require('nodemailer'); // Import nodemailer
const crypto = require('crypto'); // Import crypto

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: 'info@consolegaming.in', // Your email address
    pass: 'rdvx znri pknd xjqj', // Your email password
  },
});

class PaymentController {
  async createOrder(req, res) {
    try {
      const { amount, currency } = req.body;
      const order = await PaymentService.createOrder(amount, currency);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { orderId, paymentId, signature, userId, amount } = req.body; // Include userId and amount in the request body
      
      // Add a delay before verifying the payment signature
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay

      const isValid = await PaymentService.verifyPaymentSignature(orderId, paymentId, signature);
      if (isValid) {
        // Calculate CP to add based on the amount
        let cpToAdd = 0;
        if (amount == 500) {
          cpToAdd = 100;
        } else if (amount == 1025) {
          cpToAdd = 250;
        } else if (amount == 2100) {
          cpToAdd = 600;
        }

        // Update user's wallet
        await UserService.updateUserWallet(userId, amount, cpToAdd);

        // Send email notification
        await transporter.sendMail({
          from: 'info@consolegaming.in',
          to: 'talkwithakshat@gmail.com',
          subject: 'Payment Verified',
          text: `Payment of amount ${amount} has been verified for user ID ${userId}.`,
        });

        res.json({ success: true, message: 'Payment verified and wallet updated successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async handleWebhook(req, res) {
    const secret = '1234';

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === digest) {
      // Process the webhook event
      const event = req.body.event;
      const payload = req.body.payload;

      // Handle different event types
      if (event === 'payment.captured') {
        const payment = payload.payment.entity;
        // Process the captured payment
        // For example, update the order status in your database

        // Send email notification
        await transporter.sendMail({
          from: 'info@consolegaming.in',
          to: 'talkwithakshat@gmail.com',
          subject: 'Payment Captured',
          text: `Payment of amount ${payment.amount / 100} ${payment.currency} has been captured for payment ID ${payment.id}. Full webhook body: ${JSON.stringify(req.body)}`,
        });
      }

      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  }
}

module.exports = new PaymentController();


