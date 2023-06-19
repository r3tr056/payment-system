
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    custId: { type: String, require: true },
    requestType: { type: String, require: true },
    mid: { type: String, require: true },
    websiteName: { type: String },
    orderId: { type: String, require: true },
    callbackURL: { type: String, require: true },
    address: [
        {type: Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    txnAmount: {
        value: { type: Number, require: true },
        currency: { type: String, require: true },
    },
    state: { type}
}, { timestamps: true });

module.exports = mongoose.model('payment', PaymentSchema);
