const express = require('express');

const invoicesController = require('../controllers/invoices');
const authJwt = require("../middleware/authJwt");
const router = express.Router();

router.get('/test', invoicesController.apiTest);

router.get('/list', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.getInvoices);

router.get('/list/:invoiceId', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.getInvoice);

router.get('/pdf/:invoiceId', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.getInvoiceInPDF)

router.get('/contacts', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.getContacts)

router.post('/contacts/create', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.createContact);

router.post('/create', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.createInvoice);

router.delete('/delete/:invoiceId', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.deleteInvoice)

router.put('/update/:invoiceId', [authJwt.verifyToken, authJwt.isAdmin], invoicesController.updateInvoice)

module.exports = router