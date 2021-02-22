const getJWT = require('../utils/getJWT');

const { validationResult } = require('express-validator')
const { jwtSecret, authCookieName } = require('../config/config')
const Course = require('../models/Course')
const User = require('../models/User')

function getRegister(req, res) {
    res.render('register');
}

function getLogin(req, res) {
    res.render('login');
}

function getLogout(req, res) {

    res.clearCookie(authCookieName);
    console.log(`you are logged out`);
    res.redirect('/');

}

function postRegister(req, res, err) {
    const { username, password, rePassword } = {...req.body };
    // console.log(username);
    // console.log(password);
    // console.log(rePassword);

    User.create({ email, username, password })
        .then(() => { res.redirect('/user/login') })
        .catch(err)

    //С директно логване
    // User.create({ username, password })
    //     .then(() => {
    //         User.findOne({ username })
    //             .then((user) => {
    //                 console.log(user);
    //                 const token = getJWT.createToken(user._id);

    //                 res
    //                     .status(200)
    //                     .cookie(authCookieName, token, { httpOnly: true }, { maxAge: 3600000 })
    //                     .redirect('/products')
    //             }).catch(next)
    //     }).catch(err)

}

function postLogin(req, res, next) {
    const { username, password } = {...req.body };

    User.findOne({ username })
        .then(user => {
            return Promise.all([
                user,
                user ? user.comparePasswords(password, next) : false
            ])
        })
        .then(([user, match]) => {
            if (!match) {
                res.render('login', { errorMessage: 'Wrong username or password' });
                return;
            }

            const token = getJWT.createToken(user._id);


            res
                .status(200)
                .cookie(authCookieName, token, { httpOnly: true }, { maxAge: 3600000 })
                .redirect('/products')
        })
        // .catch(err => {err  {message: 'alabala'}});
        .catch(next)
}
module.exports = {
    getRegister,
    getLogin,
    getLogout,


    postRegister,
    postLogin,

}