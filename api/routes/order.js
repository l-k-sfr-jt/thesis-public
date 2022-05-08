const express = require('express');

const orderController = require('../controllers/order');
const {body} = require("express-validator");

const router = express.Router();

router.get('/list', orderController.getOrders);

router.get('/list/:orderId', orderController.getOrder);

router.get('/for/:techId', orderController.getOrdersFor)

//TODO: VALIDATOR
router.post(
    '/create',
    [

    ],
    orderController.createOrder);

router.put('/update/:orderId', orderController.updateOrder);

router.post('/export/:offerId', orderController.exportToPDF);

router.delete('/delete', orderController.deleteOrder);

module.exports = router;