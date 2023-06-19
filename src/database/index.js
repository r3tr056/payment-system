const mongoose = require('mongoose');
const { MONGODB_URL } = require('../config');

module.exports = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log(`DB CONNECTED : ${MONGODB_URL}`);
    } catch (error) {
        console.log('Error ============== ');
        console.log(error);
    }
};
