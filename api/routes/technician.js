const express = require('express');
const {body} = require('express-validator');

const technicianController = require('../controllers/technician');
const authJwt = require("../middleware/authJwt");

const router = express.Router();

// GET /feed/posts
router.get('/list', [authJwt.verifyToken, authJwt.isAdmin], technicianController.getTechnicians);

// POST /feed/post
router.post(
    '/create',
    [],
    technicianController.createTechnician
);

router.put('/update', [authJwt.verifyToken, authJwt.isAdmin], technicianController.updateTechnician);

router.delete('/delete', [authJwt.verifyToken, authJwt.isAdmin], technicianController.deleteTechnician);

router.get('/list/:techId', [authJwt.verifyToken, authJwt.isAdmin], technicianController.getTechnician);

router.get('/positions', [authJwt.verifyToken, authJwt.isAdmin], technicianController.getTechnicianPositions);

router.post('/positions/create', [authJwt.verifyToken, authJwt.isAdmin], technicianController.createTechnicianPosition)

module.exports = router;
