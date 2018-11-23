const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

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

})

module.exports = app;

