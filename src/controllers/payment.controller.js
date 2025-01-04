const PaymentService = require('../services/payment.service');

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
      const { orderId, paymentId, signature } = req.body;
      const isValid = await PaymentService.verifyPaymentSignature(orderId, paymentId, signature);
      if (isValid) {
        res.json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new PaymentController();
