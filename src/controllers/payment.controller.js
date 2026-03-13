const Payment = require('../models/Payment');
const Order = require('../models/Order');

// UC-28: Create Payment (Customer)
const createPayment = async (req, res) => {
  try {
    const { orderId, method = 'vnpay' } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required.' });

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Order already paid.' });

    const payment = await Payment.create({ order: orderId, user: req.user._id, amount: order.totalPrice, method });
    res.status(201).json({ message: 'Payment initiated.', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-29: VNPay Checkout (Customer)
const vnpayCheckout = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findOne({ _id: paymentId, user: req.user._id });
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });

    // Simulate VNPay URL generation
    // In production: integrate with VNPay SDK / API
    const vnpayUrl = `${process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'}?vnp_Amount=${payment.amount * 100}&vnp_OrderInfo=Order_${payment.order}&vnp_TxnRef=${payment._id}`;

    res.json({ message: 'VNPay checkout URL generated.', vnpayUrl, paymentId: payment._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VNPay return callback
const vnpayReturn = async (req, res) => {
  try {
    const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = req.query;

    const payment = await Payment.findById(vnp_TxnRef);
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });

    if (vnp_ResponseCode === '00') {
      payment.status = 'success';
      payment.transactionId = vnp_TransactionNo;
      payment.vnpayData = req.query;
      await payment.save();
      await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });
      return res.json({ message: 'Payment successful.', payment });
    } else {
      payment.status = 'failed';
      await payment.save();
      return res.json({ message: 'Payment failed.', payment });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPayment, vnpayCheckout, vnpayReturn };
