const express = require('express');

const orderController = require('../controllers/order');
const {body} = require("express-validator");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

router.get('/list', orderController.getOrders);

router.get('/list/:orderId', orderController.getOrder);

router.get('/for/:techId', orderController.getOrdersFor)

//TODO: VALIDATOR
router.post(
    '/create',
    [authJwt.verifyToken, authJwt.isAdmin],
    orderController.createOrder);

router.put('/update/:orderId', [authJwt.verifyToken, authJwt.isAdmin], orderController.updateOrder);

router.post('/export/:offerId', [authJwt.verifyToken, authJwt.isAdmin], orderController.exportToPDF);

router.delete('/delete', [authJwt.verifyToken, authJwt.isAdmin], orderController.deleteOrder);

module.exports = router;