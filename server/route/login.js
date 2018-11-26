const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req,res) => {

    let body = req.body;

    User.findOne({ email : body.email},  (err, userDB)=>{

        if(err) {
            return res.status(500).json({
                ok:false,
                error : err
            });
        }

        // Pregunto si trajo usuario
        if (!userDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o contraseña incorrecta'
                }
            });
        }

        // Pregunto si las contraseñas coinciden
        if (!bcrypt.compareSync( body.password, userDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o contraseña incorrecta'
                }
            });
        }
        
        let token = jwt.sign({
            user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRANCE})

        // El usuario se puede logear
        return res.json({
            ok:true,
            usuario: _.pick(userDB, ['name', 'email']),
            token
        });
        
    });

});

// Google config
async function verify( token ) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google-login', async (req,res) => {
    
    let token = req.body.token;
    let googleUser = await verify(token)
        .catch( e => {
            return res.status(403).json({
                ok:false,
                err: e
            });
        });

    User.findOne({email: googleUser.email}, (err, userDB)=> {

        if(err) {
            return res.status(500).json({
                ok:false,
                error : err
            });
        }

        if(userDB) {
            if(userDB.google === false){
                return res.status(400).json({
                    ok:false,
                    error : {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            }
            else{
                let token = jwt.sign({
                    user: userDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRANCE});

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        }
        else{
            // Si el usuario no existe en nuestra db
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':D'

            user.save((err, userDB) => {

                if(err){
                    return res.status(500).json({
                        ok:false,
                        error : err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRANCE});

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });

            });
        }


    })
        
    
});

module.exports = app;

