/**
 * Classe nascosta per la gestione della crittografia E2E con l'algoritmo di DiffieHelmann.
 */

const crypto = require('crypto');

//Creo l'istanza DiffieHelmann.
const serverDC = crypto.createDiffieHellman('modp15');
const serverWS = crypto.createDiffieHellman('modp15');

//Creo la coppia di chiavi per ogni interlocutore
serverDC.generateKeys();
serverWS.generateKeys();

//Mi ricavo la chiave pubblica del serverDC e del serverWS
const pubKeyDC = serverDC.getPublicKey();
const pubKeyWS = serverWS.getPublicKey();

//Condivisione dei secreti
const secretDC = serverDC.computeSecret(pubKeyWS, null, 'base64');
const secretWS = serverWS.computeSecret(pubKeyWS, null, 'base64');

if(secretDC==secretWS)
    return true;
else
    return false;  