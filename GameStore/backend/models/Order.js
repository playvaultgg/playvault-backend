const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    // Human-friendly unique order identifier (separate from Mongo _id)
    orderId: { type: String, unique: true, index: true },
    orderItems: [
        {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            game: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Game' },
        }
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    paymentMethod: { type: String, required: true, default: 'FamPay' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
}, { timestamps: true });

// Generate a readable unique orderId before saving if not already set
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderId = `PV-${timestamp}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
