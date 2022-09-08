const express = require('express');

const mainController = require('../controllers/mainController');
const viewController = require('../controllers/viewController');
const router = express.Router();

router.get('/', viewController.getIndex)

router.get('/team', mainController.getTeam);
router.post('/team', mainController.postTeam);

router.post('/match', mainController.postMatch);

router.get('/stadium', mainController.getStadium);
router.get('/stadium/:name', mainController.getStadiumByName);
router.post('/stadium', mainController.postStadium);

router.get('/city', mainController.getCity);
router.get('/city-add-info', mainController.getCitiesWithAdditionalInfo);
router.post('/city', mainController.postCity)

router.post('/sponsor', mainController.postSponsor)

router.post('/referee', mainController.postReferee)

router.post('/contract', mainController.postContract)

router.post('/player', mainController.postPlayer)
router.get('/players', mainController.getPlayers)


router.post('/player-contract', mainController.postPlayerContract)

router.post('/ticket', mainController.postTicket)

router.post('/sector', mainController.postSector)

module.exports = router;