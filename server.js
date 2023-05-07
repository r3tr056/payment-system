

const functions = require("firebase-functions")
const axios = require("axios")


const PaytmChecksum = require('./config/checksum')
const PaytmConfig = require('./config/config')

const server = http.createServer()

var MERCHANT_KEY = process.env("MERCHANT_KEY")

server.on('request', (req, response) => {
    switch(req.url) {
        case "/paynow":
            console.log('Hello Payment Processor!');
            

            var paytmParams = {
                requestType: "Payment",
                mid: req.body.MID,
                webisteName: "WEBSITE",
                orderId: req.body.ORDER_ID,
                callbackUrl: req.body.CB_URL,
                txnAmount: {
                    value: req.body.TXN_AMOUNT,
                    currency: "INR",
                },
                userInfo: {
                    custId: req.body.CUST_ID,
                },
            };

            var paytmChecksum = PaytmChecksum.generateSignature(JSON.stringify(paytmParams), MERCHANT_KEY)
            
            paytmChecksum.then((result) => {
                console.log("generateSignature Returns : " + result)
                var post_data = {body: paytmParams, head: {signature: result}};
                let paytmInitTransactionAPIUrl = `https://securegw.paytm.in/theia/api/v1/initiateTransaction?mid=${paytmParams.mid}&orderId=${paytmParams.orderId}`;

                return axios.post(paytmInitTransactionAPIUrl, post_data).then((res) => {
                    console.log(res.data);
                    return response.send(res.data)
                }).catch((err) => {
                    console.log(err);
                    response.status(500).send(err)
                });
            })
        }
    }
)
