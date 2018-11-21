// =====================
// Puerto Server
// =====================

process.env.PORT = process.env.PORT || 3000;

// =====================
// Entorno
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================
// Entorno DB
// =====================

let dbURL;

if (process.env.NODE_ENV == 'dev'){
    dbURL = 'mongodb://localhost:27017/cafe';
}
else{
    dbURL = process.env.MONGO_URL
}

process.env.dbURL = dbURL;