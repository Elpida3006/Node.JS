const { Router } = require('express');
const router = Router();
const service = require('../services/productServise');
const Hotel = require('../models/Hotel')
const User = require('../models/User')
    // const { validateInput } = require('../middlewares/inputValidate');
    // const { isValidObjectId } = require('mongoose');
    // const cubeCreatorCheck = require('../utils/cube-creator-check')
    // const isLogged = require('../middlewares/check-auth');


router.get('/', (req, res) => {

    service.getAllHotels()
        .then(hotels => {
            res.render('home', { hotels })
        })

});


router.get('/create', (req, res) => {
    res.render('create')


});
router.post('/create', (req, res, error) => {
    const { name, city, freeRooms, imageUrl } = req.body
    console.log(req.body);


    service.createHotel(req.body, req.user._id)
        .then(() => res.redirect('/products'))
        .catch(error => console.error(`Not created`))
})
router.get('/details/:id', (req, res, next) => {
    let hoteId = req.params.id
    let myID = req.user._id.toString()

    console.log(myID);

    let isCreator = false;
    let isBooked = false;

    service.getId(hoteId)
        .then(hotel => {
            let creatotId = hotel.ownerCreatorId.toString();

            console.log(creatotId);
            if (creatotId == myID) {
                isCreator = true;
                console.log(`YOU ARE CREATOR`);
            } else {
                hotel.userBookedHotels = hotel.userBookedHotels.map(x =>
                    x.toString());
                //userBookedHotels
                if (hotel.userBookedHotels.includes(myID)) {
                    isBooked = true;
                    console.log(`YOU ARE BOOKED THIS HOTEL`);
                }
            }

            res.render('details', { hotel, isCreator, isBooked })
        })
        .catch(next)
});
router.get('/book/:id', (req, res, error) => {
    // let hoteId = req.params.id
    // let myID = req.user._id.toString()
    // console.log(hoteId);
    // console.log(myID);

    // service.book(hoteId, myID)
    //     .then(() => {
    //         res.redirect('/products')
    //     })
    //     .catch(error => {
    //         console.error(`Do not book a hotel`)
    let itemId = req.params.id;
    console.log(req.user._id.toString());
    let userId = req.user._id.toString();

    Promise.all([
            Hotel.updateOne({ _id: itemId }, { $push: { userBookedHotels: userId } }),
            Hotel.findById(itemId).freeRooms -= 1,
            User.updateOne({ _id: userId }, { $push: { bookedHotels: itemId } })
        ])
        .then(() => {
            res.redirect('/products');
        })
        .catch(error => {
            console.error(`Do not book a hotel`)
        })
})
router.get('/delete/:id', (req, res, next) => {
    let hotelId = req.params.id

    service.deleteHotel(hotelId)
        .then(() => {
            res.redirect('/products')
        })
        .catch(next)


});

router.get('/edit/:id', (req, res) => {
    let hotelId = req.params.id

    service.getId(hotelId)
        .then(hotel => {
            res.render('edit', { hotel })
        })
        .catch(error => {
            console.error(`Edit page not found`)
            res.redirect('/products')
        });

})
router.post('/edit/:id', (req, res) => {
    let hotelId = req.params.id
    console.log(hotelId);
    let myID = req.user._id
    const { name, city, imageUrl, freeRooms } = req.body
    console.log(req.body);
    service.postEditHotel(hotelId, req.body)
        .then(() => {
            console.log(`UPDATED`);
            res.redirect(`/products`)
        })
        .catch(error => console.error(`Edit  not found`));


})

module.exports = router;