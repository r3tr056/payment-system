const PaymentService = require('../services/paymentService');
const { SubscribeMessage } = require('../utils.js');

module.exports = (server, channel) => {

const service = new PaymentService();
SubscribeMessage(channel, service);

server.get("/whoami", (req, res, next) => {
    return res.status(200).json({msg: "/ or /payments : I am the payments Service"});
});

server.get('/paywithpaytm', (req, response) => {

        var paytmParams = {
            requestType: "Payment",
            mid: req.body.MID,
            webisteName: req.body.WEBSITE_NAME,
            orderId: shortid.generate(),
            callbackUrl: req.body.CB_URL,
            txnAmount: {
                value: req.body.TXN_AMOUNT,
                currency: "INR",
            },
            userInfo: {
                custId: shortid.generate(),
            },
        };

        checksum.generateChecksum(JSON.stringify(paytmParams), config.MERCHANT_ID).then((err, checksum) => {
            if (err) {
                response.status(500).send(err);
            }
            paytmParams.CHECKSUMHASH = checksum;
            var post_data = {body: paytmParams, head: {signature: checksum}};

            let paytmInitTransactionAPIUrl = config.PAYTM_FINAL_URL + `?mid=${paytmParams.mid}&orderId=${paytmParams.orderId}`;

            return axios.post(paytmInitTransactionAPIUrl, post_data).then((res) => {
                return response.send(res.data);
            })
        }).catch((err) => {
            response.status(500).send(err)
        })
    }
)

server.post("/paytmcallback", (req, response) => {
    const paytmChecksum = req.body.CHECKSUMHASH;
    var isVerifyChecksum = checksum.verifyChecksum(req.body, config.MERCHANT_ID, paytmChecksum)
    if (isVerifyChecksum) {
        var paytmParams = {
            mid: req.body.MID,
            orderId: req.body.ORDERID,
        };

        checksum.generateChecksum(JSON.stringify(paytmParams), config.MERCHANT_ID).then((err, checksum) => {
            var post_data = {body: paytmParams, head: {signature: checksum}};

            let paytmStatusAPIUrl = config.PAYTM_ORDER_STATUS_URL;
            return axios.post(paytmStatusAPIUrl, post_data).then((res) => {
                return response.status(200).send(res);
            })
        })
        .catch(err => response.status(500).send(err))

    } else {
        response.status(500).send({message: "Checksum mismatched"})
    }
})

}