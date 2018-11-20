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
    dbURL = 'mongodb://cafeuser:altairezzio1@ds227119.mlab.com:27119/cafe'
}

process.env.dbURL = dbURL;