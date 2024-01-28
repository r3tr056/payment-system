const mongoose = require('mongoose');
const address = require('./address');

const merchantSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    email: { type: String, require: true },
    website: { type: String, require: false },
    address: address,
    paymentGateways: [String],
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
});

merchantSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Merchant', merchantSchema);