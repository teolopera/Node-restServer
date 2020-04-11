// Process -> Objeto global que corre a lo largo de la aplicacion de node

/* ================ PUERTO ================ */
process.env.PORT = process.env.PORT || 3000;

/* ================ ENTORNO ================ */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // Si esta variable no existe suponemos que estamos en desarrollo

/* ================ BASE DE DATOS ================ */
let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://Makami:W6mlMjfsJsyTngXP@cafe-lmcjb.mongodb.net/Cafe';
}

process.env.URLDB = urlDB;

/* ================ BD LOCAL ================ */
//mongodb://localhost:27017/cafe

/* ================ BD MONGO ATLAS ================ */
//mongodb+srv://<username>:<password>@cafe-lmcjb.mongodb.net/test