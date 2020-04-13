/* EXPRESS */
const express = require("express");

/* BCRYPT */
const bcrypt = require("bcrypt");

/* UNDERSCORE LIBRARY */
const _ = require("underscore");

/* IMPORTAMOS LOS MODELS */
const User = require("../models/user");

/* IMPORTAMOS EL MIDDLEWARE AUTENTICACION */
const {verificaToken, verificaAdminRol} = require('../middlewares/autenticacion');

const app = express();

// Cambiamos el send por el json por que vamos a hacer una aplicacion REST
/* USAMOS EL MIDDLEWARE PARA VERIFICAR EL TOKEN */
app.get("/user", verificaToken ,(req, res) => {

  /* REQ.USUARIO TIENE TODA LA INFORMACION DEL USUARIO 
  return res.json({
    usuario: req.usuario,
    nombre: req.usuario.nombre,
    email: req.usuario.email
  }) */

  // Parametros opcionales -> ?desde=10 desde donde queremos cargar los registros
  let desde = req.query.desde || 0;
  desde = Number(desde);

  // Para el limite de registros que queremos por pagina
  let limite = req.query.limite || 5;
  limite = Number(limite);

  /* PODEMOS ESPECIFICAR UNA CONDICION EN EL FIND */
  User.find({estado: true}, 'nombre email role estado google img') /* {} CONDICION si se pone aca va en el count tambien */
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      // Recibe un error y el resultado o respuesta
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      User.count({estado: true}, (err, conteo) => {
        res.json({
          ok: true,
          cantidadReg: conteo,
          usuarios: usuarios
        });
      });
    });

  // res.json("Get Usuario");
});

/* ARREGLO DE MIDDLEWARES -> ENTRE LLAVES POR QUE SON VARIOS */
app.post("/user", [verificaToken, verificaAdminRol], (req, res) => {
  let body = req.body;

  /* CREAMOS UN OBJETO DE TIPO USER (MODEL) */
  let user = new User({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  /* GRABANDO EL OBJETO EN LA BASE DE DATOS */
  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    /* Para no mandar la constraseña por seguridad - 1ra Forma */
    //usuarioDB.password = null;

    res.json({
      ok: true,
      user: userDB,
    });
  });
});

/* Aqui obtendremos un id para poder actualizar el parametro :id */
app.put("/user/:id", [verificaToken, verificaAdminRol], (req, res) => {
  /* Para poder obtener ese parametro :id */
  let id = req.params.id;

  /* Obtenemos el body, usamos el pick para pasarle del objeto las propiedades que se podran modificar */
  let body = _.pick(req.body, ["nombre", "email", "role", "estado"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }, //https://mongoosejs.com/docs/api/query.html
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      // Si todo sale bien
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});

app.delete("/user/:id", [verificaToken, verificaAdminRol], (req, res) => {
  
  let id = req.params.id;

  let cambiaEstado = {
    estado: false
  };

  /* LO CAMBIAMOS POR QUE YA NO SE ACOSTUMBRA A BORRAR LOS DATOS SINO A CAMBIAR EL ESTADO */
  // User.findByIdAndRemove(id, (err, usuarioDeleted) => 

  User.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, userDeleted) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      if(!userDeleted){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no encontrado.'
          }
        })
      }

      res.json({
        ok: true,
        usuario: userDeleted
      })
  });  
});

/* EXPORTACIONES */
module.exports = app;