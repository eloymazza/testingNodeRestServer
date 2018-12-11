const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static( path.resolve(__dirname ,'../public')))

app.use(require('./route/index'))

mongoose.connect(process.env.dbURL, { useNewUrlParser: true} , (err, succ)=> {
    
    if(err){
        throw new Error("Cannot connect to Database " + err);
    }
    else{
        console.log('DB connected');
    }
    
});

app.listen(process.env.PORT, ()=> {
    console.log('Listen Port 3000');
    
})