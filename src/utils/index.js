const bcrypt = require('bcryptjs');
const jwt = requre('jsonwebtoken');
const amqplib = require('amqplib');

const {
    APP_SECRET,
    EXCHANGE_NAME,
    PAYMENT_SERVICE,
    MSQ_QUEUE_URL,
} = require('../config');

module.exports.ValidateSignature = async (req) => {
    try {
        const signature = req.get("Authorization");
        console.log(signature);
        const payload = await jwt.vefify(signature.split("")[1], APP_SECRET);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports.GenerateSignature = async (payload) => {
    try {
        return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    } catch (error) {
        console.log(error);
        return error;
    }
};

// Message broker
module.exports.CreateChannel = async() => {
    try {
        const connection = await amqplib.connect(MSQ_QUEUE_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
        return channel;
    } catch (error) {
        throw error;
    }
};

module.exports.PublishMessage = (channel, service, msg) => {
    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent : ", msg);
};

module.exports.SubscribeMessage = async (channel, service) => {
    await channel.asssertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log(`Waiting for messages in queue : ${q.queue}`);

    channel.bindQueue(q.queue, EXCHANGE_NAME, PAYMENT_SERVICE);
    channel.consume(
        q.queue,
        (msg) => {
            if (msg.content) {
                console.log("The message is :", msg.content.toString());
                service.SubscribeEvents(msg.content.toString());
            }
            console.log("[X] received");
        },{ noAck: true }
    );
}