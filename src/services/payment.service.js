const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: 'rzp_live_NPwaQIImGlemVc',
  key_secret: 'WW61wrDtWqPCuZPGZ3JvQvCh',
});

class PaymentService {
  async createOrder(amount, currency = 'INR') {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: crypto.randomUUID(),
    };
    return await razorpayInstance.orders.create(options);
  }

  async verifyPaymentSignature(orderId, paymentId, signature) {
    const generatedSignature = crypto.createHmac('sha256', 'WW61wrDtWqPCuZPGZ3JvQvCh')
      .update(orderId + '|' + paymentId)
      .digest('hex');
    return generatedSignature === signature;
  }
}

module.exports = new PaymentService();
