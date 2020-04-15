const express = require("express");

let { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

let app = express();

let Producto = require("../models/producto");

app.get("/producto", verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                  ok: false,
                  err
                });
              }

              res.json({
                ok: true,
                productos
            });
        })
});

app.get("/producto/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }
    
          if (!productoDB) {
            return res.status(400).json({
              ok: false,
              err: {
                message: 'El id no es correcto'
              }
            });
          }

          res.json({
            ok: true,
            producto: productoDB
          });
    })
});

/* BUSCAR PRODUCTOS */
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

  let termino = req.params.termino;

  /* PARA HACER QUE LA BUSQUEDA SEA MAS FLEXIBLE NECESITAMOS MANDAR UNA EXPRESION REGULAR */
  /* LA i ES PARA QUE SEA INSENSIBLE A LAS MAYUSCULAS Y MINUSCULAS */
  let regexp = new RegExp(termino, 'i');

  /* HACEMOS QUE EL NOMBRE HAGA UN MATCH CON EL TERMINO PARA LA BUSQUEDA */
  Producto.find({nombre:regexp})
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos
      })
    })
})

app.post("/producto", verificaToken, (req, res) => {
    
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }

          res.status(201).json({
              ok: true,
              producto: productoDB
          });
    });
});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }
      
          if(!productoDB){
              return res.status(400).json({
                  ok: false,
                  err: {
                      message: 'El producto no existe.'
                  }
              });
          }

            productoDB.nombre = body.nombre,
            productoDB.precioUni = body.precioUni,
            productoDB.descripcion = body.descripcion,
            productoDB.disponible = body.disponible,
            productoDB.categoria = body.categoria

            productoDB.save( (err, productoGuardado ) => {
                
                if (err) {
                    return res.status(500).json({
                      ok: false,
                      err,
                    });
                  }

                  res.json({
                      ok: true,
                      producto: productoGuardado
                  });
            });
    });
});

app.delete("/producto/:id", [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }

          if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe.'
                }
            });
            }
        
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                  ok: false,
                  err,
                });
              }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Eliminado Correctamente'
            })
        })
    })
});

module.exports = app;