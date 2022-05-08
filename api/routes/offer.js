const express = require('express');
const {body} = require("express-validator");

const offerController = require('../controllers/offer');
const router = express.Router();

router.get('/list', offerController.getOffers);

router.get('/list/:offerId', offerController.getOffer);

//TODO: VALIDATOR
router.post(
    '/create',
    [],
    offerController.createOffer);

router.post('/export/:offerId', offerController.exportToPDF);

router.put('/update/:offerId', offerController.updateOffer);

router.delete('/delete', offerController.deleteOffer);

module.exports = router;