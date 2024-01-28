
const mongoose = require('mongoose');

const Schema = mongoose.Schama;

const AddressSchema = new Schema({
    street: String,
    zip: String,
    state: String,
    city: String,
    country: String
});

module.exports = mongoose.model('Address', AddressSchema);