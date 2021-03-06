const { Router } = require('express');
const router = Router();
const service = require('../services/productServise');


router.get('/', (req, res) => {
    // const userId = req.user._id
    // console.log(userId);

    service.getAllArticles()
        .then(articles => {
            res.render('home', { articles })
        })
        .catch(err => console.error)
        // res.render('home')

});


router.get('/create', (req, res) => {
    res.render('create')


});
router.post('/create', (req, res, error) => {
    console.log(req.body);
    console.log(req.user._id);

    service.createArticle(req.body, req.user._id)
        .then(() => {
            console.log(`Article is created`)
            res.redirect('/products')
        })
        .catch(error => { res.render('create', { error }); })
});


router.get('/details/:id', (req, res, next) => {
    let articleId = req.params.id


    // console.log(articleId);
    // console.log(myID);
    let isCreator = false;
    let myID;
    let isBuyer = false;

    service.getId(articleId)
        .then(article => {
            let creatotId = article.createdBy.toString();
            if (req.user) {
                myID = req.user._id.toString()
            }

            console.log(creatotId);
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
            article.buyers = article.buyers.map(x =>
                x.toString());
            //userBookedHotels
            if (article.buyers.includes(myID)) {
                isBuyer = true;
                console.log(`YOU ARE BUYER THIS MODEL`);
            }

            res.render('details', { article, isCreator, isBuyer })
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
router.get('/buy/:id', (req, res, error) => {
    let itemId = req.params.id;
    // console.log(itemId);
    // console.log(req.user._id.toString());
    let userId = req.user._id.toString();


    service.buy(itemId, userId)
        .then(() => {
            console.log(`BUY Product`);
            res.redirect('/products');
        })
        .catch(error => {
            console.error(`Do not buy a model`)
        })
})

module.exports = router;