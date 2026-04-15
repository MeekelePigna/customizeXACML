// Athentication service main file
// FUNCTIONS

/**
 * Callback dopo aver autenticato l'utente: Viene rilasciato un token di autenticazione.
 * @param {*} _ 
 * @param {*} res 
 */
exports.postLogin = (_, res) => {
    res.send({
        token: 'LWeoJHBP9JlUorPOqAW48IUo79ewwxsojUFSoVTHb7asou8crzLriLK57qPRsxmd'
      });
};

/**
 * Callback dopo aver autorizzato l'accesso all'utente. Viene rilasciato un token di accesso (Bearer token).
 * @param {*} req 
 * @param {*} res 
 */
exports.postAuthorize = (req, res) => {
  if(req.headers.refreshToken != '') {
    res.send({
        auth_token: 'GSzosZzKW5RSEkUT5QmZy8A27FT9kgP7m2oDVLVR3Qy0DCH2ew0S0F8XHuAdybRyJVVZv4s4QoYxfgogjGaT7adSjHf1dAMU3pq5qb'
    });
  }
};