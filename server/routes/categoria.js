const express = require("express");

let { verificaToken, verificaAdminRol } = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categorias");

/* MOSTRAR TODAS LAS CATEGORIAS */
app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({})
        /* EL POPULATE REVISA QUE IDS O QUE OBJECTS ID EXISTEN EN LA CATEGORIA QUE ESTOY SOLICITANDO 
           Y NOS PERMITIRA CARGAR INFORMACION SOBRE ESTA*/
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                  ok: false,
                  err
                });
              }

            res.json({
                ok: true,
                categorias
            });
        });
});

/* MOSTRAR UNA CATEGORIA POR ID */
app.get("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El id no es correcto'
          }
        });
      }

      res.json({
        ok: true,
        categoriaDB
      })
    })
});

/* CREAR NUEVA CATEGORIA */
app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!categoriaDB){
        return res.status(400).json({
            ok: false,
            err
        });
    }

    res.json({
        ok:true,
        categoria: categoriaDB
    });
  });
});

/* ACTUALIZAR CATEGORIA */
app.put("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }
      
          if(!categoriaDB){
              return res.status(400).json({
                  ok: false,
                  err
              });
          }

          res.json({
            ok:true,
            categoria: categoriaDB
        });
    })

});

/* ELIMINAR CATEGORIA - SOLO UN ADMINISTRADOR PUEDE ELIMINAR */
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }
      
          if(!categoriaDB){
              return res.status(400).json({
                  ok: false,
                  err: {
                      message: 'El id no existe'
                  }
              });
          }

          res.json({
              ok: true,
              categoria: categoriaDB,
              message: 'Categoria Eliminada'
          });
    })
});

module.exports = app;
