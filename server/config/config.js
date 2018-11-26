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

// =====================
// Token Expirance
// =====================

process.env.TOKEN_EXPIRANCE = 60 * 60 * 24 * 30;

// =====================
// Auth Seed
// =====================

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'seed-development'

// =====================
// Client ID
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '283294739320-jq6686liu0rif8dg1c310ktvpra8i23u.apps.googleusercontent.com';