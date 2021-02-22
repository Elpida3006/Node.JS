const { Router } = require('express');

const productController = require('./controllers/productController');
const homeController = require('./controllers/homeController');
// const accessoryController = require('./controllers/accessoryController')
const userController = require('./controllers/userController')
const router = Router();

router.use('/', homeController);
router.use('/products', productController);
// router.use('/accessories', accessoryController);
router.use('/user', userController);
router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;