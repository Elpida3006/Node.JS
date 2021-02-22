const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const saltRounds = config.saltRounds;

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,

    username: {
        type: String,
        required: true,
        unique: true,
        validate: [/^[a-zA-Z0-9]+$/, 'The username should consist only english letters and digits'],
        // unique: [true, 'this username arlredy exist']
        minlength: [4, 'The username should be at least 4 characters long']
    },
    password: {
        type: String,
        required: true,
        unique: false,
        minlength: [4, 'The password should be at least 4 characters long']
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        validate: [/^[0-9.]+$/, 'The username should be positive number'],

    },
    expenses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Expense'
    }]
});
userSchema.methods.comparePasswords = function(providedPassword) {
    //callback или  Promise, защото е асинхронна операция
    return new Promise((resolve, reject) => {
        bcrypt.compare(providedPassword, this.password, function(err, result) {
            if (err) { reject(err); return; }
            resolve(result);
            // result връща  true /false
        });
    });
};
userSchema.post('save', function(error, _, next) {
    next(error.code === 11000 ?
        new Error('This item field already exist') :
        error)
});
userSchema.pre('save', function(done) {

    const user = this;

    if (!user.isModified('password')) {
        done();
        return;
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) { done(err); return; }
        //tuk e s callback
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { done(err); return; }
            user.password = hash;
            //ako potrebitelq e nov, ili e smenil parolata, da ni q heshira
            done();
        });
    });
});
module.exports = mongoose.model('User', userSchema);