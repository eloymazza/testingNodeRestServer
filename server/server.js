const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./route/user'));

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