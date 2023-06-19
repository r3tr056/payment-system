const mongoose = require('mongoose');
const { PaymentModel, AddressModel } = require('../models');

class PaymentsRepository {
    async CreatePayment({customerId, orderId, txnAmount, requestType, cb_url, address, websiteName}) {
        const payment = new PaymentModel({
            custId: customerId,
            orderId: orderId,
            txnAmount: txnAmount,
            requestType: requestType,
            callbackURL: cb_url,
            address: address,
            websiteName: websiteName
        });
        const paymentResult = await payment.save();
        return paymentResult;
    }

    async Payments(customerId) {
        const payments = await PaymentModel.find({custId: customerId});
        return payments;
    }

    async FindPaymentById({id}) {
        const existingPayment = await PaymentModel.findById(id).populate('address')
        return existingPayment;
    }

    async GetPayment(orderId) {
        const payment = await PaymentModel.find({orderId});
        return payment;
    }

    async AddAddressToPayment({id, address}) {
        const payment = await PaymentModel.findById(id);
        if (payment) {
            if (payment.state == 'uninitialized') {
                payment.address = []
            }
            payment.address.push(address);
            const paymentResult = await payment.save();
            return paymentResult;
        }
    }

}

module.exports = PaymentsRepository;