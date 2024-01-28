
const express = require('express');
const cors = require('cors');
const config = require('./config');
const shortid = require('shortid');
const checksum = require("./lib/checksum");
const { default: axios } = require('axios');
const databaseConnection = require('./database')
const { CreateChannel } = require('./utils')
const customer_api = require('./api')
const apiKeyMiddleware = require('./api/middlewares/auth');

const server = express();

await databaseConnection();
const channel = await CreateChannel()

server.use(express.json());
server.use(cors());
server.use(express.static(__dirname + '/public'));

server.use('/api', apiKeyMiddleware)
customer_api(app, channel);

server.listen(config.SERVER_PORT, () => {
    console.log(`Payment Processor Microservice is Listening on PORT : ${config.SERVER_PORT}`);
}).on('error', (err) => {
    console.log(err);
    process.exit();
}).on('close', () => {
    channel.close();
})