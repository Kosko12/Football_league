const express = require('express');

const mainController = require('../controllers/mainController');
const viewController = require('../controllers/viewController');
const router = express.Router();

router.get('/', viewController.getIndex)

router.get('/team', mainController.getTeam);
router.get('/teams', mainController.getTeams);
router.get('/team/guest/:name', mainController.getGuestForMatch);
router.post('/team', mainController.postTeam);
router.delete('/team', mainController.deleteTeam)

router.post('/match', mainController.postMatch);
router.get('/match', mainController.getMatch);
router.delete('/match', mainController.deleteMatch);

router.get('/stadium', mainController.getStadium);
router.get('/stadium/:name', mainController.getStadiumByName);
router.post('/stadium', mainController.postStadium);
router.patch('/stadium', mainController.patchStadium);
router.delete('/stadium', mainController.deleteStadium)

router.get('/city', mainController.getCity);
router.get('/city-add-info', mainController.getCitiesWithAdditionalInfo);
router.post('/city', mainController.postCity)
router.delete('/city', mainController.deleteCity)


router.post('/sponsor', mainController.postSponsor)
router.get('/sponsor', mainController.getSponsor)
router.delete('/sponsor/:name', mainController.deleteSponsor)

router.post('/referee', mainController.postReferee)
router.get('/referee', mainController.getReferee)
router.delete('/referee', mainController.deleteReferee)


router.post('/contract', mainController.postContract)
router.get('/contract', mainController.getContract)
router.delete('/contract', mainController.deleteContract)

router.post('/player', mainController.postPlayer)
router.patch('/player', mainController.patchPlayer)
router.get('/players', mainController.getPlayers)
router.delete('/player', mainController.deletePlayer)

router.post('/player-contract', mainController.postPlayerContract)

router.post('/ticket', mainController.postTicket)

router.post('/sector', mainController.postSector)

module.exports = router;