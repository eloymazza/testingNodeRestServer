const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function (req,res) {
    res.json('get usuario');
});

app.post('/usuario', function (req,res) {
    let body = req.body;
    body.name === undefined ? res.status(400).json('Name is required') : res.json({body});

});

app.put('/usuario/:id', function (req,res) {
    res.json({
        id:req.params.id
    });
});

app.delete('/usuario', function (req,res) {
    res.json('delete usuario');
});

app.listen(process.env.PORT, ()=> {
    console.log('Listen Port 3000');
    
})