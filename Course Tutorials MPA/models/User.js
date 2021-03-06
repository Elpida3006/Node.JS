const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const saltRounds = config.saltRounds;

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
        // maxlength: 60,
        // minlength: 3
    },
    bookedCourse: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    }],
 
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