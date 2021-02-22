const getJWT = require('../utils/getJWT');
// const checkLogin = require('../middlewares/check-auth');
const { validationResult } = require('express-validator')
const { jwtSecret, authCookieName } = require('../config/config')
    // const Article = require('../models/Article')
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
    const { username, password, rePassword } = req.body;
    // console.log(req.body);
    // console.log(username);
    // console.log(password);
    // console.log(rePassword);

    User.create({ username, password })
        .then(() => {

            res.redirect('/user/login')
        })
        .catch(err)
        // .catch((err) => {
        //     // let errors = validationResult(req)
        //     if (err.errors) {
        //         console.log(err.errors);
        //         console.log(errors);
        //         let error = Object.keys(err.errors).map(everyError =>
        //             ({ msg: err.errors[everyError].properties.msg }))[0];

    //         res.render('register', { error });
    //         }



    // })
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
        .catch(next);
}
module.exports = {
    getRegister,
    getLogin,
    getLogout,


    postRegister,
    postLogin,

}