const express = require('express');
const app = express();
const User = require('../models/user')

app.get('/usuario', function (req,res) {
    res.json('get usuario is working');
});

app.post('/usuario', function (req,res) {

    let body = req.body;
    let user = new User({
        name : body.name,
        email: body.email,
        password: body.password,
        role: body.role
    });
    
    user.save((err, userDB) => {

        if(err){
            res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            user: userDB
        });

    });
    
 
});

app.put('/usuario/:id', function (req,res) {
    res.json({
        id:req.params.id
    });
});

app.delete('/usuario', function (req,res) {
    res.json('delete usuario');
});

module.exports = app;