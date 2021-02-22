const { body } = require('express-validator');
const validator = require('validator');
// const repeatPasswordCheck = body('repeatPassword').custom((value, { req }) => {
//     if (value !== req.body.password) {
//         throw new Error('Passwords don\'t match!')
//     }
//     return true;
// });
const repeatPasswordCheck = (req, res, next) => {
    // let password = req.body.password;
    // let repeatPassword = req.body.rePassword;
    const { email, username, password, rePassword } = {...req.body };

    // console.log(password);
    // console.log(repeatPassword);
    if (password !== rePassword) {
        // console.log(password);
        // console.log(repeatPassword);
        // throw { msg: 'Password missmatch!' }
        return res.render('register', { error: { message: 'Password missmatch!' } });
    }
    next()
}

const isFullPassword = (req, res, next) => {
    let password = req.body.password;
    let primarlyPass = /^[a-zA-Z0-9]+$/;

    if (!primarlyPass.test(password)) {
        return res.render('register', { error: { message: 'Password is not STRONG and should contain only english letters and digits!' } });
        // throw { msg: 'Password is not STRONG and should contain only english letters and digits!' }

    }

    next()
}
const strongPassword = (req, res, next) => {
    let password = req.body.password;
    let isStrong = validator.isStrongPassword(password, {
        // maxlength: //,
        // minlength: //
    });
    if (!isStrong) {
        return res.render('register', { error: { message: 'Password is not STRONG' }, username: req.body.username });
        // throw { msg: 'Password is not STRONG' }
    }




    next()
}


const validateUsername = username => {
    // const minLength = 4;
    const regEx = /^[a-zA-Z0-9]+$/;

    if (username.length < minLength) {
        throw { message: `Username should have minimum length of ${minLength}!` };
    }

    if (!regEx.test(username)) {
        throw { message: 'Username should contain only english letters and digits!' };
    }

    return username;
};

const validatePassword = password => {
    const regEx = /^[a-zA-Z0-9]+$/;
    const minLength = 4;

    if (password.length < minLength) {
        throw { message: `Password must be at least ${minLength} chars long!` }
    }

    if (!regEx.test(password)) {
        throw { message: 'Password should contain only english letters and digits!' };
    }

    return password;
};



module.exports = {
    repeatPasswordCheck,
    isFullPassword,
    strongPassword,
    validateUsername,
    validatePassword,

};