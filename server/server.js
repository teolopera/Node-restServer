/* PUERTO */
require("./config/config");

/* EXPRESS */
const express = require("express");
const app = express();

/* MONGOOSE */
const mongoose = require("mongoose");

/* IMPORTAMOS PATH PARA PODER BRINDAR LA DIRECCION DE LOS ARCHIVOS ESTATICOS */
const path = require('path');

/* BODY-PARSER Paquete que permite procesar la informacion que nos mandan y la serializa
 * En un objeto JSON para que sea facilmente procesada en las peticiones POST
 */
const bodyParser = require("body-parser");
/* BODY-PARSER - MIDDLEWARES */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* HABILITANDO LA CARPETA PUBLIC PARA SER ACCESIBLE DESDE CUALQUIER LUGAR */
app.use( express.static(path.resolve(__dirname, '../public')) );

/* CONFIGURACION GLOBAL DE RUTAS */
app.use( require('./routes/index') );

/* CONEXION A LA BASE DE DATOS */
mongoose.connect(process.env.URLDB , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
},
(err, res) => {
  if (err) throw err;
  console.log('Base de datos Online');
});

// Puerto
app.listen(process.env.PORT, () => {
  console.log("Escuchando en el puerto", process.env.PORT);
});

