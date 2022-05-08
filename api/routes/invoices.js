const express = require('express');

const invoicesController = require('../controllers/invoices');
const router = express.Router();

router.get('/test', invoicesController.apiTest);

router.get('/list', invoicesController.getInvoices);

router.get('/list/:invoiceId', invoicesController.getInvoice);

router.get('/pdf/:invoiceId', invoicesController.getInvoiceInPDF)

router.get('/contacts', invoicesController.getContacts)

router.post('/contacts/create', invoicesController.createContact);

router.post('/create', invoicesController.createInvoice);

router.delete('/delete/:invoiceId', invoicesController.deleteInvoice)

router.put('/update/:invoiceId', invoicesController.updateInvoice)

module.exports = router