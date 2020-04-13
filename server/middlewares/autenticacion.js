const jwt = require("jsonwebtoken");

/* ============= VERIFICAR TOKEN ============= */
/* NEXT -> CONTINUA CON LA EJECUCION DEL PROGRAMA */
let verificaToken = (req, res, next) => {
  /* OBTENEMOS EL HEADER DE LA PETICION */
  let token = req.get("Authorization");

  /* VERIFICAMOS SI EL TOKEN ES VALIDO */
  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido.",
        },
      });
    }

    /* DECODED -> PAULOAD - INFORMACION DEL USUARIO */
    /* CUALQUIER PETICION PUEDA TENER ACCESO A LA INFO DEL USUARIO POR HABER PASAR VERIFICATOKEN */
    req.usuario = decoded.usuario;

    /* SI NO PONEMOS EL NEXT NUNCA SE EJECUTARA LO QUE VIENE DESPUES */
    next();
  });
};

/* ============= VERIFICAR ROL DE ADMIN ============= */
let verificaAdminRol = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {
    next();
    return;
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es Administrador.",
      },
    });
  }
};

module.exports = {
  verificaToken,
  verificaAdminRol
};
