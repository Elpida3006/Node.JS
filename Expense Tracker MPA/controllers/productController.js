const { Router } = require('express');
const router = Router();
const service = require('../services/productServise');
const Expense = require('../models/Expense')
const User = require('../models/User')
    // const { validateInput } = require('../middlewares/inputValidate');
    // const { isValidObjectId } = require('mongoose');
    // const cubeCreatorCheck = require('../utils/cube-creator-check')
    // const isLogged = require('../middlewares/check-auth');


router.get('/', (req, res) => {

    service.getAll()
        .then(expenses => {
            res.render('home', { expenses })
        })
        // res.render('home')
});


router.get('/create', (req, res) => {
    res.render('create')


});
router.post('/create', (req, res, error) => {
    console.log(req.body);


    service.createE(req.body, req.user._id)
        .then(() => res.redirect('/'))
        .catch(error => {
            console.log(error);
            res.render('create', { error });
        })
})
router.get('/report/:id', (req, res, error) => {
    let expenseID = req.params.id
    let myID = req.user._id.toString()

    //     // console.log(myID);

    let isCreator = false;
 

    service.getId(expenseID)
        .then(expense => {
            let creatotId = expense.ownerCreatorId.toString();

            console.log(creatotId);
            if (creatotId == myID) {
                isCreator = true;
                console.log(`YOU ARE CREATOR`);
            }
          
            res.render('report', { expense, isCreator })

        })
        // .catch(next)
        .catch(error => { res.render('home', { error: { message: 'Yoy are not permission for this page - Go to home Page' } }); })

});

router.get('/delete/:id', (req, res, next) => {
    let expenseID = req.params.id
    console.log(expenseID);
    service.deleteE(expenseID)
        .then(() => {
            res.redirect('/')
        })
        .catch(next)


});



module.exports = router;