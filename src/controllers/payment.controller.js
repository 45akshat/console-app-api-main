const PaymentService = require('../services/payment.service');
const UserService = require('../services/user.service'); // Import UserService
const nodemailer = require('nodemailer'); // Import nodemailer

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
}

module.exports = new PaymentController();
