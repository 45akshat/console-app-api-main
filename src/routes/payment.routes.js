const express = require('express');
const PaymentController = require('../controllers/payment.controller');

const router = express.Router();

router.post('/create-order', PaymentController.createOrder);
router.post('/verify-payment', PaymentController.verifyPayment);
router.post('/webhook', PaymentController.handleWebhook);

module.exports = router;
