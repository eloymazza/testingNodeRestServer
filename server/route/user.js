const express = require('express');
const app = express();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function (req,res) {
    
    let query = req.query;
    let from = Number(query.from || 0);
    let limit = Number(query.limit || 5);
    let userFilter = {};
    
    if(query.active != undefined){
        userFilter = {state:req.query.active}
    }
    
    User.find(userFilter, 'name email')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    error : err
                });
            }

            User.count({}, (err, count) => {

                if(err){
                    return res.status(400).json({
                        ok:false,
                        error : err
                    });
                }
                res.json({
                    ok:true,
                    users,
                    count
                })
            })
        })

});


app.post('/usuario', function (req,res) {

    let body = req.body;
    let user = new User({
        name : body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });
    
    user.save((err, userDB) => {

        if(err){
            res.status(400).json({
                ok:false,
                error : err
            });
            res.end();
        }
        else{

            res.json({
                ok:true,
                user: userDB
            });
        }

    });
    
});

// Edit user
app.put('/usuario/:id', function (req,res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name','email','img','role','state']);

    User.findByIdAndUpdate(id, body, (err, updatedUserDB) => {

        if(err) {
            return res.status(400).json({
                ok:false,
                error : err
            });
        }

        res.json({
            ok: true,
            user : updatedUserDB
        });
    })

});

// Disable user
app.put('/usuario/desactivar/:id', function (req,res){

    let id = req.params.id;
    let body = {state : false}

    
    User.findByIdAndUpdate(id, body, {new:true}, (err, disabledUser) => {
        if(err){
            return res.status(400).json({
                ok:false,
                error : err
            }); 
        }

        res.json({
            ok:true,
            user: disabledUser
        });
    })

})


// Physical remove
app.delete('/usuario/:id', function (req,res) {
    
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, removedUserDB) => {
        if(err) {
            return res.status(400).json({
                ok:false,
                error : err
            });
        }

        if(!removedUserDB){
            return res.status(400).json({
                ok:false,
                error : {
                    err,
                    message : 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok:true,
            user: removedUserDB
        })
    })

});

module.exports = app;