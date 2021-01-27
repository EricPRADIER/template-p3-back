const router = require('express').Router();
const adminRouter = require('./admin.routes.js');
const albumRouter = require('./album.routes.js');
const songRouter = require('./song.routes.js');
const userRouter = require('./user.routes.js');

router.use('/admins', adminRouter);
router.use('/albums', albumRouter);
router.use('/songs', songRouter);
router.use('/users', userRouter);

module.exports = router;