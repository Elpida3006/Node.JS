const { Router } = require('express');
const router = Router();
const service = require('../services/productServise');
const Course = require('../models/Course')
const User = require('../models/User')

router.get('/', (req, res) => {

    service.getAll(req)
        .then(courses => {
            res.render('home', { courses })
        })
        // res.render('home')

});

router.get('/create', (req, res) => {
    res.render('create')


});
router.post('/create', (req, res, error) => {
    // const {title, description, imageUrl, isPublic} = req.body
    // console.log(req.body);
    // creatorId = req.user._id

    service.create(req.body, req.user._id)
        .then(() => res.redirect('/products'))
        .catch(error => { res.render('create', { error }); })
        //.catch(error => { res.render('create', { error: { message: "Try again" } }); })

});
router.get('/details/:id', (req, res, next) => {
    let productID = req.params.id
    let myID = req.user._id.toString()

    console.log(myID);

    let isCreator = false;
    let isEnroll = false;

    service.getId(productID)
        .then(product => {
            let creatotId = product.creatorId.toString();

            console.log(creatotId);
            if (creatotId == myID) {
                isCreator = true;
                console.log(`YOU ARE CREATOR`);
            } else {
                product.userBookedEnrolled = product.userBookedEnrolled.map(x =>
                    x.toString());
                //userBookedHotels
                if (product.userBookedEnrolled.includes(myID)) {
                    isEnroll = true;
                    console.log(`YOU ARE BOOKED/ENROLL THIS product`);
                }
            }

            res.render('details', { product, isCreator, isEnroll })
        })
        .catch(next)
});
router.get('/enroll/:id', (req, res, error) => {

    let itemId = req.params.id;
    // console.log(req.user._id.toString());
    let userId = req.user._id.toString();

    return Promise.all([
            Course.updateOne({ _id: itemId }, { $push: { userBookedEnrolled: userId } }),
            User.updateOne({ _id: userId }, { $push: { bookedCourse: itemId } })
        ])
        .then(() => {
            res.redirect('/products');
        })
        .catch(error => {
            console.error(`Do not enroll a course`)
        })
})
router.get('/delete/:id', (req, res, next) => {
    let productID = req.params.id

    service.deleted(productID)
        .then(() => {
            res.redirect('/products')
        })
        .catch(next)


});

router.get('/edit/:id', (req, res) => {
    let productID = req.params.id

    service.getId(productID)
        .then(product => {
            let isChecked = product.isPublic
            res.render('edit', { product, isChecked })
        })
        .catch(error => {
            console.error(`Edit page not found`)
            res.redirect('/products')
        });

})
router.post('/edit/:id', (req, res, next) => {
    let productID = req.params.id
        // console.log(productID);
    let myID = req.user._id
        // console.log(req.body);
    service.postEdit(productID, req.body)
        .then(() => {
            console.log(`UPDATED`);
            res.redirect(`/products`)
        })
        // .catch(error => { res.render('create', { error: { message: "Try again" } }); })
        .catch(next)


})

module.exports = router;