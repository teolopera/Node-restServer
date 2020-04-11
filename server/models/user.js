/* ENCARGADO DE TRABAJAR EL MODELO DE DATOS */

/* MONGOOSE */
const mongoose = require('mongoose');

/* MONGOOSE-UNIQUE-VALIDATOR */
const uniqueValidator = require('mongoose-unique-validator');

/* ROLES VALIDOS */
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un Rol Valido.'
};

const Schema = mongoose.Schema;

// Definimos el esquema
let userSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        // El ROL debe existir dentro de esta Enumeracion
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

/* Para no mandar la contraseña por seguridad - 2da forma */
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})

/* EXPORTAMOS EL MODELO */
module.exports = mongoose.model('User', userSchema);