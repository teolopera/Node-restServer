const express = require("express");
const bcrypt = require("bcrypt");

/* JWT TOKENS */
const jwt = require("jsonwebtoken");

/* GOOGLE AUTHENTICATION */
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require("../models/user");
const app = express();

app.post("/login", (req, res) => {
  let body = req.body;

  /* VERIFICAMOS SI EL CORREO EXISTE */
  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario y/o Contraseña incorrectos.",
        },
      });
    }

    /* TOMAMOS LA CONTRASEÑA Y LA ENCRIPTAMOS PARA VER SI HACEN MATCH */
    if (!bcrypt.compareSync(body.password, userDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario y/o Contraseña incorrectos.",
        },
      });
    }

    /* GENERAMOS EL TOKEN */
    let token = jwt.sign(
      {
        /* PAYLOAD -> AQUI PODEMOS PONER LOS OBJETOS QUE QUERAMOS */
        usuario: userDB,
      },
      process.env.SEED_TOKEN,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    ); /* EXPIRA EN 30 DIAS */

    res.json({
      ok: true,
      usuario: userDB,
      token,
    });
  });
});

/* CONFIGURACIONES DE GOOGLE */
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  console.log(payload);

  /* MANDANDO UN OBJETO PERSONALIZADO - EL PAYLOAD DE POR SI YA TIENE TODA LA INFORMACION PERO LA MANDAREMOS PERSONALIZADA */
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

/* CONFIGURAMOS LA RUTA PARA EL ID TOKEN DE GOOGLE SIGN IN */
app.post("/google", async (req, res) => {

  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    res.status(403).json({
      ok: false,
      err: e,
    });
  });

  /* VALIDAMOS QUE NO HAYAN USUARIOS CON ESE CORREO */
  User.findOne({email: googleUser.email}, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    };

    if(userDB){
      if(userDB.google === false){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe usar su autenticacion normal.'
          }
        });
      } else {
        /* RENOVAMOS EL TOKEN */
        let token = jwt.sign(
          {
            usuario: userDB,
          },
          process.env.SEED_TOKEN,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        ); 

        return res.json({
          ok: true,
          usuario: userDB,
          token
        });
      }
    } else { // Si no existe en nuestra base de datos
      let usuario = new User();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save((err, userDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        };

        let token = jwt.sign(
          {
            usuario: userDB,
          },
          process.env.SEED_TOKEN,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        ); 

        return res.json({
          ok: true,
          usuario: userDB,
          token
        });
      })

    }

  })

  // res.json({
  //   usuario: googleUser
  // });
});

module.exports = app;
