const router = require('express').Router();
const songRouter = require('./song.routes.js');
const albumRouter = require('./album.routes.js');

router.use('/song', songRouter);
router.use('/album', albumRouter);

module.exports = router;