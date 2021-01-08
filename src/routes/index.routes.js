const router = require('express').Router();
const adminRouter = require('./admin.routes.js');
const trackListRouter = require('./tracklist_move.route.js');

router.use('/admins', adminRouter);
router.use('/tracklist', trackListRouter);

module.exports = router;