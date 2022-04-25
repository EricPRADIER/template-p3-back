const router = require('express').Router();
const usersRouter = require('./user.routes');
const animalsRouter = require('./animal.routes');
const productsRouter = require('./product.routes');
const restaurantsRouter = require('./restaurant.routes');

router.use('/users', usersRouter);
router.use ('/animals', animalsRouter);
router.use('/products', productsRouter);
router.use('/restaurants', restaurantsRouter);

module.exports = router;