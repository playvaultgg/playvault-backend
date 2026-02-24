const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ['FamPay', 'FamPay-QR', 'Stripe'], default: 'FamPay-QR' },
    paymentStatus: { type: String, required: true, enum: ['PENDING', 'UNDER_REVIEW', 'success', 'failed', 'cancelled'], default: 'PENDING' },
    transactionId: { type: String },
    receiptUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
