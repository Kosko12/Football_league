const express = require('express');

const mainController = require('../controllers/mainController');

const router = express.Router();

router.get('/team', mainController.getTeam);

router.post('/team', mainController.postTeam)

// router.post('/tables', mainController.postTables);

// router.post('/create-dish', mainController.postDish);
// router.post('/create-dishes', mainController.postDishes);

// router.post('/check-availability', mainController.checkTablesAvailability)
// router.post('/make-reservation', mainController.prostReservation);

module.exports = router;