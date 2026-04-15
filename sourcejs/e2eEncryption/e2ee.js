const crypto = require('crypto');
const fs = require('fs');

/**
 * Generatore delle chiavi: Una pubblica per criptare e una privata per decriptare.
 */
function generateKeys() {
    const {publicKey, privateKey} = crypto.generateKeyPair('rsa', { modulusLength: 2048});

    fs.writeFileSync('xacml_kpublic.pem', publicKey.export({ type: 'pkcs1', format: 'pem' }));
    fs.writeFileSync('xacml_kprivate.pem', privateKey.export({ type: 'pkcs1', format: 'pem' }));
}

/**
 * Imposta le chiavi pubbliche e private.
 */
exports.setKeys = () => {
    generateKeys()
}

/**
 * Cripto i dati.
 * @param {*} data2Encr Stringa da crittare
 * @returns Dati crittati
 */
exports.EncryptData = (data2Encr) => {
    const publicKey = fs.readFileSync('xacml_kpublic.pem', 'utf8');
    const encryptedData = crypto.publicEncrypt(publicKey, data2Encr);
    return encryptedData;
}

/**
 * Decritto i dati.
 * @param {*} data2Dec Stringa da rendere in chiaro.
 * @returns Stringa in chiaro.
 */
exports.DecryptData = (data2Dec) => {
    const privateKey = fs.readFileSync('xacml_kprivate.pem', 'utf8');
    const decryptedData = crypto.publicDecrypt(privateKey, data2Dec);
    return decryptedData;
}