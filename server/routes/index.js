const express = require("express");
const app = express();

/* AQUI PONDREMOS TODAS LAS RUTAS PARA ORGANIZAR EL CODIGO */
app.use( require('./user') );
app.use( require('./login') );

module.exports = app;