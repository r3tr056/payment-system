
const util = require("util");
const crypto = require("crypto");

const I_VECTOR = '@@@@&&&&####$$$$';

export function encrypt(input, key) {
    var cipher = crypto.createCipheriv('AES-128-CBC', key, I_VECTOR);
    var encrypted = cipher.update(input, 'binary', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

export function decrypt(encrypted, key) {
    var decipher = crypto.createDecipheriv('AES-128-CBC', key, I_VECTOR);
    var decrypted = decipher.update(encrypted, 'base64', 'binary');
    try {
        decrypted += decipher.final('binary');
    } catch (e) {
        console.log(e);
    }
    return decrypted;
}


export function generateChecksum(params, key) {
    if (typeof params !== 'object' && typeof params !== "string") {
        var error = "string or object expected, " + (typeof params) + " given.";
        return Promise.reject(error);
    }

    if (typeof params != 'string') {
        params = getStringByParams(params);
    }

    return generateChecksumByString(params, key);
}

export function verifyChecksum(params, key, checksum) {
    if (typeof params !== 'object' && typeof params != 'string') {
        var error = "String or object expected, " + (typeof params) + " given.";
        return Promise.reject(error);
    }

    if (params.hasOwnProperty("CHECKSUMHASH")) {
        delete params.CHECKSUMHASH;
    }

    if (typeof params != "string") {
        params = getStringByParams(params);
    }

    return verifyChecksumByString(params, key, checksum);
}

export function verifyChecksumByString(params, key, checksum) {
    var paytm_hash = decrypt(checksum, key);
    var salt = paytm_hash.substring(paytm_hash.length - 4);
    return (paytm_hash === calculateHash(params, salt));
}

export function generateRandomString(length) {
    return new Promise(function (resolve, reject) {
        crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
            if (!err) {
                var salt = buf.toString("base64");
                resolve(salt);
            }
            else {
                console.log("error occurred in generateRandomString: " + err);
                reject(err);
            }
        });
    });
}

export function calculateHash(params, salt) {
    var finalString = params + "|" + salt;
    return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
}

export function calculateChecksum(params, key, salt) {
    var hashString = calculateHash(params, salt);
    return encrypt(hashString, key);
}

export async function generateChecksumByString(params, key) {
    var salt = await generateRandomString(4);
    return calculateChecksum(params, key, salt);
}