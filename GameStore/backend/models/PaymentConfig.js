const mongoose = require('mongoose');

const paymentConfigSchema = new mongoose.Schema(
    {
        upiId: {
            type: String,
            required: true,
        },
        payeeName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('PaymentConfig', paymentConfigSchema);

