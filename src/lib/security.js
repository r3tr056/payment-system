
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const axios = require('axios');
const amqplib = require("amqplib");
const config = require('../config');


module.exports.GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

module.exports.GeneratePasswordHash = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async(password, hashedPassword, salt) => {
    return (await this.GeneratePasswordHash(password, salt) === hashedPassword);
};

module.exports.ValidateSignature = async (req) => {
    try {
        const signature = req.get('Authorization');
        console.log(signature);
        const payload = await jwt.verify(signature.split(" ")[1], config.APP_SECRET);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports.GenerateSignature = async (payload) => {
    try {
        return await jwt.sign(payload, config.APP_SECRET, {expiresIn: "30d"});
    } catch (error) {
        return error;
    }
};

module.exports.FormateData = (data) => {
    if (data) { return {data}; }
    else { throw new Error("Data not found!"); }
};

// Raise Events
module.exports.PublishPaymentEvent = async (payload) => {
    axios.post(config.EVENT_SERVER_URL, { payload });
};

module.exports.PublishShoppingEvent = async (payload) => {
    axios.post(config.EVENT_SERVER_URL, { payload })
};

module.exports.CreateChannel = async () => {
    try {
        const connection = await amqplib.connect(config.MSG_QUEUE_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(config.EXCHANGE_NAME, "direct", { durable: true });
        return channel;
    } catch (err) {
        throw err;
    }
};

module.exports.PublishMessage = (channel, service, msg) => {
    channel.publish(config.EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
};