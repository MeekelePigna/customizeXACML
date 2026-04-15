const axios = require("axios");
const constants = require("../constants_vars.json");

/**
 * Callback dopo il login con autenticazione tramite credenziali di GITHUB.
 * @param {*} req 
 * @param {*} res 
 */
exports.postLogin = (req, res) => {
    axios({
        method: "POST",
        url: `${constants.GITHUB_URL}?client_id=${constants.CLIENT_ID_GITHUB}&client_secret=${constants.CLIENT_SECRET_GITHUB}&code=${req.query.code}`,
        headers: {
          Accept: "application/json",
        },
      }).then((response) => {
        if(response.data.access_token != ''){
          res.redirect(`http://localhost:3000/template`);
        }
      });
};