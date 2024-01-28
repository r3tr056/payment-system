
const mongoose = require('mongoose');
const { z } = require('zod');

const Schema = mongoose.Schema;

const PaymentZodSchema = z.object({
    custId: z.string().min(1),
    requestType: z.string().min(1),
    mid: z.string().min(1),
    websiteName: z.string().optional(),
    orderId: z.string().min(1),
    callbackURL: z.string().min(1),
    address: z.array(z.string()),
    txnAmount: z.object({
        value: z.number().min(1),
        currency: z.string().min(1),
    }),
    state: z.string().min(1),
})

const PaymentSchema = new Schema({
    custId: { type: String, require: true },
    requestType: { type: String, require: true },
    mid: { type: String, require: true },
    websiteName: { type: String },
    orderId: { type: String, require: true },
    callbackURL: { type: String, require: true },
    address: [
        { type: Schema.Types.ObjectId, ref: 'Address', require: true }
    ],
    txnAmount: {
        value: { type: Number, require: true },
        currency: { type: String, require: true },
    },
    state: { type: String, require: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
