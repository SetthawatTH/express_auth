const express = require('express');
const router = express.Router();

const tripController = require('../Controllers/tripControllers');



router.post('/',tripController.post_createTrip);

module.exports = router;