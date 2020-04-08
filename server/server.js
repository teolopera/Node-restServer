/* PUERTO */
require('./config/config');

/* EXPRESS */
const express = require('express');
const app = express();

/* BODY-PARSER Paquete que permite procesar la informacion que nos mandan y la serializa 
 * En un objeto JSON para que sea facilmente procesada en las peticiones POST
 */
const bodyParser = require('body-parser');
/* BODY-PARSER - MIDDLEWARES */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Cambiamos el send por el json por que vamos a hacer una aplicacion REST
app.get('/user', (req, res) => {
    res.json('Get Usuario');
});

app.post('/user', (req, res) => {

    let body = req.body;

    if ( body.nombre === undefined ){
        res.status(400).json({
            ok: false, 
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

/* Aqui obtendremos un id para poder actualizar el parametro :id */
app.put('/user/:id', (req, res) => {

    /* Para poder obtener ese parametro :id */
    let id = req.params.id;

    res.json({
        id
    });

});

app.delete('/user', (req, res) => {
    res.json('Delete Usuario');
});



// Puerto
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', process.env.PORT);
});