//Server side NodeJS per API al WebService.
//Importo le varie librerie che serviranno.
const express = require("express");
const xacmlJson = require("./xacml.json");
const constants = require("./constants_vars.json");
const cors = require("cors");

//Inizializzazione dell'applicazione.
const app = express();

//Abilito il CORS per rendere accessibile qualsiasi origine.
app.use(cors({ credentials: true, origin: true }));

//Gestisco le rotte
//const authRoute = require("./routes/auth");
const xacmlRoute = require("./routes/xacmlPolicy");
const e2eRoute = require("./routes/e2eEncr");

//app.use('/auth', authRoute);
app.use('/xacmlPolicy', xacmlRoute);
app.use('/e2eEncr', e2eRoute);

//Politica Xacml che verrà mostrata.
app.get('/xacml', (req, res)=> {res.json(xacmlJson)});

//Avvio il server sulla porta 55879.
app.listen(constants.PORT, 
    ()=>console.log('Il server è attivo sulla porta: ' + constants.PORT));