const CustomerModel = require('../../database/models/customer');
const AddressModel = require('../../database/models/address');
const config = require('../../config');
const { verifyPIN } = require('../../lib/paycoin/token_utils');

// geo-coding for address
const googleMapsClient = require('@google/maps').createClient({
    key: config.GOOGLE_MAPS_API_KEY
})

module.exports = (server, channel) => {
    server.post('customers', async (req, res) => {
        // Extract info from request body
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name, email or password is missing' });
        }

        try {
            // Create a customer object
            const customer = new CustomerModel({ name, email });
            await customer.save();
            // Respond with the customer object
            res.status(201).json(customer);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error!', error: error.message });
        }

    });

    server.delete('/customers/:customerId', async (req, res) => {
        try {
            const custId = req.params.customerId;
            const deletedCustomer = await CustomerModel.findOneAndRemove(customerId);

            if (!deletedCustomer) {
                return res.status(404).json({ message: `Customer with customerId: ${custId} not found` });
            }

            res.json({ message: 'Customer deleted successfully.', deletedCustomer });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error!', error: error.message });
        }
    });

    server.put('/customers/:customerId', async (req, res) => {
        try {
            const customerId = req.params.customerId;
            const customer = await CustomerModel.findById(customerId);

            if (!customer) {
                return res.status(404).json({ message: `Customer with customerId : ${customerId} not found` });
            }

            // update the data from the request
            const { name, email } = req.body;

            // update only if data is provided
            if (name) customer.name = name;
            if (email) customer.email = email;

            await customer.save();

            res.json({ message: 'Customer updated successfully.', updatedCustomer: customer })
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error!', error: error.message });
        }
    });

    server.put('/customers/:customerId/billing-address', async (req, res) => {
        try {
            const customerId = req.params.customerId;
            const customer = await CustomerModel.findById(customerId);

            if (!customer) {
                return res.status(404).json({ message: `Customer with customerId : ${customerId} not found` });
            }

            const { street, city, state, zip, country } = req.body;
            const billingAddress = new AddressModel({ street, city, state, zip, country });
            if (billingAddress) customer.billingAddress = billingAddress;

            await customer.save();

            res.json({ message: 'Customer updated successfully.', updatedCustomer: customer });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error!', error: error.message });
        }
    })

    server.post('/verify-pin', async (req, res) => {
        const customerId = req.params.customerId;
        // Retreive user information
        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: `Customer with customer Id : ${customerId} not found` });
        }

        const { address, pin } = req.body;

        // Validate request params
        if (!address || !pin) {
            return res.status(400).json({ error: 'Invalid params' });
        }

        // Verify PIN
        if (!verifyPIN(pin, customer.encryptedPrivateKey)) {
            return res.status(401).json({ error: 'Invalid PIN' });
        }

        res.status(200).json({ message: 'PIN verification successful' })
    });
}