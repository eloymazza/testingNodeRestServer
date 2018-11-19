const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let validRoles = {
    values : ['ADMIN_ROLE','USER_ROLE'],
    message:  '{VALUE} is not a valid role'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'Password is required']
    },
    img : {
        type: String,
        required: false
    },
    role : {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google : {
        type: Boolean,
        default: false
    }
});


userSchema.plugin(uniqueValidator, {
    message:'{PATH} debe ser unico'
});

module.exports = mongoose.model('User', userSchema);

