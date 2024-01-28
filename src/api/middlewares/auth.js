
const { ValidateSignature } = require('../../lib/security');

module.exports = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // If the API key is missing, return a 401 error
    if (!apiKey) {
        return res.status(401).send({ message: 'API key is required' });
    }
    // Validate the API key
    const isAuthorized = await ValidateSignature(apiKey);
    if (isAuthorized) {
        return next();
    }
    return res.status(403).json({ message: 'Not Authorized' })
}