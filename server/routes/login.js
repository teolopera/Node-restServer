const express = require("express");
const bcrypt = require("bcrypt");

/* JWT TOKENS */
const jwt = require('jsonwebtoken');

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
          message: "Usuario y/o Contraseña incorrectos."
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
    let token = jwt.sign({
        /* PAYLOAD -> AQUI PODEMOS PONER LOS OBJETOS QUE QUERAMOS */
        usuario: userDB
    }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN}); /* EXPIRA EN 30 DIAS */

    res.json({
      ok: true,
      usuario: userDB,
      token
    });
  });
});

module.exports = app;
