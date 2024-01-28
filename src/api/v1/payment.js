const PaymentModel = require("../../database/models/payment");
const CustomerModel = require("../../database/models/customer");


module.exports = (server, channel) => {

    // Get all payments for a customer
    server.get('/customers/:custId/payments', async (req, res) => {
        try {
            const customer = await CustomerModel.findById(req.params.custId).populate('payments');
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found!' });
            }
            const payments = customer.payments;
            res.status(200).json({ payments });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrive payments' })
        }
    });

    // Get a single payment by ID
    server.get('/customers/:custId/payment/:paymentId', async (req, res) => {
        try {
            const { custId, paymentId } = req.params;
            const customer = await CustomerModel
                .findById(custId)
                .populate({
                    path: 'payments',
                    match: { _id: paymentId }
                });

            if (!customer) {
                return res.status(404).json({ message: 'Customer not found!' });
            }

            const payment = customer.payments.find(p => p._id.equals(paymentId))
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found!' });
            }

            res.status(200).json({ payment });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrive payment' });
        }
    });

    // Create a new payment object
    server.post('/customers/:customerId/payments', async (req, res) => {
        const customerId = req.params.customerId;
        const paymentData = req.body;

        try {
            const customer = await CustomerModel.findById(customerId);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const newPayment = new Payment(paymentData);
            customer.payments.push(newPayment);

            await customer.save();

            res.status(201).json({ message: 'Payment added successfully', payment: newPayment });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrive payment' });
        }
    });
}