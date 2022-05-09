const express = require('express');
const {body} = require("express-validator");

const offerController = require('../controllers/offer');
const authJwt = require("../middleware/authJwt");
const router = express.Router();

router.get('/list', [authJwt.verifyToken, authJwt.isAdmin], offerController.getOffers);

router.get('/list/:offerId', [authJwt.verifyToken, authJwt.isAdmin], offerController.getOffer);

//TODO: VALIDATOR
router.post(
    '/create', [authJwt.verifyToken, authJwt.isAdmin], offerController.createOffer);

router.post('/export/:offerId', [authJwt.verifyToken, authJwt.isAdmin], offerController.exportToPDF);

router.put('/update/:offerId', [authJwt.verifyToken, authJwt.isAdmin], offerController.updateOffer);

router.delete('/delete', [authJwt.verifyToken, authJwt.isAdmin], offerController.deleteOffer);

module.exports = router;