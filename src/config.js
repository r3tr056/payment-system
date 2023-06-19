require("dotenv").config();

module.exports = {
    MONGODB_URL: process.env.MONGODB_URL,
    SERVER_PORT: 8002,
    APP_SECRET: process.env.APP_SECRET,
    MERCHANT_ID: process.env.MERCHANT_ID,
    PAYTM_ORDER_STATUS_URL: process.env.PAYTM_ORDER_STATUS_URL || 'https://securegw-stage.paytm.in/v3/order/status',
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL || 'https://securegw-stage.paytm.in/theia/processTransaction',
}