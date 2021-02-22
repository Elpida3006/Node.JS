const getJWT = require('../utils/getJWT');

const { validationResult } = require('express-validator')
const { jwtSecret, authCookieName } = require('../config/config')
const Expense = require('../models/Expense')
const User = require('../models/User')

function getRegister(req, res) {
    res.render('register');
}

function refill(req, res, error) {
    const userId = req.user._id
    const { refill } = req.body
    console.log(refill);
    //updateOne
    Promise.all([
        User.findById(userId),
        Expense.find({}).where('user').equals(userId)
    ]).then(([user, expenses]) => {


        User.findByIdAndUpdate(userId, { amount: user.amount + +refill })
            .then(() => {
                res.redirect('/');
            })
            .catch(error => {
                console.log(`not refill`);
            })
    });


}

function getProfile(req, res) {
    // let count = User.count.find({})
    let userId = req.user._id
    Promise.all([
        User.findById(userId),
        Expense.find({}).where('ownerCreatorId').equals(userId)
    ]).then(([user, expenses]) => {
        res.render('profile', {
            user,
            total: expenses.reduce(function(a, b) { return a + b.total; }, 0),
            count: expenses.length,
            amount: user.amount
        });
    });

}



function getLogin(req, res) {
    res.render('login');
}

function getLogout(req, res) {

    res.clearCookie(authCookieName);
    console.log(`you are logged out`);
    res.redirect('/');

}

function postRegister(req, res, error) {
    const { username, password, rePassword, amount } = {...req.body };
    // console.log(amount);
    // console.log(username);
    // console.log(password);
    // console.log(rePassword);

    User.create({ username, password, amount })
        .then(() => { res.redirect('/user/login') })
        .catch(error => {
            console.log(error);
            res.render('register', { error });
        })

    //С директно логване
    // User.create({ username, password ,amount})
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
        .catch(error => {
            console.log(error);
            res.render('register', { error });
        })
}
module.exports = {
    getRegister,
    getLogin,
    getLogout,
    getProfile,

    postRegister,
    postLogin,
    refill
}