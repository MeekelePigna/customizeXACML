/**
 * Classe che gestisce l'autenticazione di Google.
 */

//Definizione e valorizzazione variabili.
const axios = require("axios");
const jwt = require("jsonwebtoken");
const constants = require("../constants_vars.json");

/**
 * Ottiene i parametri di autenticazione: costruisce il JSON da passare alla callback login.
 * @returns JSON dei parametri di autenticazione.
 */
const getAuthParams = () => new URLSearchParams({
  client_id: constants.CLIENT_ID_GOOGLE,
  redirect_uri: constants.GOOGLE_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email',
  access_type: 'offline',
  state: 'standard_oauth',
  prompt: 'consent'
});

/**
 * Ottiene i parametri necessari per ottenere il token bearer.
 * @param {*} code 
 * @returns 
 */
const getTokenParams = (code) => new URLSearchParams({
  client_id: constants.CLIENT_ID_GOOGLE,
  client_secret: constants.CLIENT_SECRET_GOOGLE,
  code,
  grant_type: 'authorization_code',
  redirect_uri: constants.GOOGLE_REDIRECT_URI,
});

/**
 * Callback dopo il login con autenticazione tramite credenziali di GOOGLE.
 * @param {*} _ 
 * @param {*} res 
 */
exports.postLogin = (_, res) => {
  //Costruisco l'URL.
  const baseURL = `${constants.GOOGLE_AUTH_URI}`;
  const authParams = getAuthParams().toString();
  var urlAuth = baseURL + '?' + authParams;

  res.json({
    url: urlAuth,
  });
};

/**
 * Callback function chiamata dall' URL Callback definito nell'APP Google OAUTH 2.0.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.postCallback = async(req, res) => {
  const { code } = req.query;
  
  //Controllo sul code: refresh token.
  if (!code) return res.status(400).json({ message: 'Token di autorizzazione non riconosciuto.' });
    try {
      //Ottengo i parametri per il Bearer Token
      const tokenParam = getTokenParams(code).toString();

      //Recupero il Bearer Token dal Refresh token.
      const { data: { id_token} } = await axios.post(`${constants.GOOGLE_TOKEN_URI}?${tokenParam}`);
      if (!id_token) return res.status(400).json({ message: 'Errore di autenticazione.' });
      //Ottengo le informaizoni dell'utente, queste non verranno utilizzate.
      const { email, name, picture } = jwt.decode(id_token);
      const user = { name, email, picture };
      //Creo il nuovo token.
      const token = jwt.sign({ user }, constants.GOOGLE_TOKEN_SECRET);

      res.json({
        auth_token: token,
      })
    } catch (err) {
      console.error('Errore: ', err);
      res.status(500).json({ message: err.message || 'Errore del Server' });
    }
}