const mongoose = require('mongoose');
const address = require('./address');
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    encryptedPrivateKey: String,
    billingAddress: { type: Schema.Types.ObjectId, ref: 'address', require: true },
    shippingAddress: { type: Schema.Types.ObjectId, ref: 'address', require: true },
    paymentMethods: [String],
    subscriptions: [String],
    active: Boolean,
    createdAt: Date,
    updatedAt: Date,
    payments: [
        { type: Schema.Types.ObjectId, ref: 'Payment' }
    ]
});

customerSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
})

module.exports = mongoose.model('Customer', customerSchema);