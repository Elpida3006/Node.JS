const { Router } = require('express');
const router = Router();
const service = require('../services/productServise');
// const Hotel = require('../models/Hotel')
// const User = require('../models/User')
//     // const { validateInput } = require('../middlewares/inputValidate');
//     // const { isValidObjectId } = require('mongoose');
//     // const cubeCreatorCheck = require('../utils/cube-creator-check')
//     // const isLogged = require('../middlewares/check-auth');


router.get('/', (req, res) => {
    // const userId = req.user._id
    // console.log(userId);

    service.getAllArticles()
        .then(articles => {
            res.render('home', { articles })
        })
        .catch(err => console.error)


});


router.get('/create', (req, res) => {
    res.render('create')


});
router.post('/create', (req, res, error) => {
    console.log(req.body);
    console.log(req.user);

    service.createArticle(req.body, req.user._id)
        .then(() => {
            console.log(`Article is created`)
            res.redirect('/products')
        })
        .catch(error => { res.render('create', { error }); })
});
router.get('/all-articles', (req, res) => {
    service.getAllArticles()
        .then(articles => {
            res.render('all-articles', { articles })
        })
        .catch(err => console.error)

})

router.get('/search', service.search)

router.get('/details/:id', (req, res, next) => {
    let articleId = req.params.id


    // console.log(articleId);
    // console.log(myID);
    let isCreator = false;
    let myID;

    service.getId(articleId)
        .then(article => {
            let creatotId = article.ownerCreatorId.toString();
            if (req.user) {
                myID = req.user._id.toString()
            }

            //             console.log(creatotId);
            if (myID) {
                if (creatotId == myID) {
                    isCreator = true;
                    console.log(`YOU ARE CREATOR`);
                } else {
                    isCreator = false;
                }
            } else {
                isCreator = false;
            }


            res.render('details', { article, isCreator })
        })
        .catch(next)
});

router.get('/delete/:id', (req, res, next) => {
    let articleId = req.params.id

    service.deleteArticle(articleId)
        .then(() => {
            res.redirect('/products')
        })
        .catch(next)


});

router.get('/edit/:id', (req, res) => {
    let articleId = req.params.id

    service.getId(articleId)
        .then(article => {
            res.render('edit', { article })
        })
        .catch(error => {
            console.error(`Edit page not found`)
            res.redirect('/products')
        });

})
router.post('/edit/:id', (req, res) => {
    let articleId = req.params.id
    console.log(articleId);
    let myID = req.user._id


    service.postEditArticle(articleId, req.body)
        .then(() => {
            console.log(`UPDATED`);
            res.redirect(`/products`)
        })
        .catch(error => console.error(`Edit  not found`));


})


module.exports = router;