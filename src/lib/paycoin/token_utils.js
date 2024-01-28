
import crypto from 'crypto';

export function encryptPrivateKey(privateKey, pin) {
    const cipher = crypto.createCipheriv('aes-256-cbc', pin);
    let encrypted = cipher.update(privateKey, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptPrivateKey(encryptedPrviateKey, pin) {
    const decipher = crypto.createCipheriv('aes-256-cbc', pin);
    let decrypted = decipher.update(encryptedPrviateKey, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

export function verifyPIN(inputPIN, encryptedPrviateKey) {
    try {
        const decrypted = decryptPrivateKey(encryptedPrviateKey, inputPIN);
        return true;
    } catch (error) {
        return false;
    }
}