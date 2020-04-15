const express = require("express");
const app = express();

/* AQUI PONDREMOS TODAS LAS RUTAS PARA ORGANIZAR EL CODIGO */
app.use( require('./user') );
app.use( require('./login') );
app.use( require('./categoria') );
app.use( require('./producto') );

module.exports = app;