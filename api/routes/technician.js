const express = require('express');
const {body} = require('express-validator');

const technicianController = require('../controllers/technician');

const router = express.Router();

// GET /feed/posts
router.get('/list', technicianController.getTechnicians);

// POST /feed/post
router.post(
    '/create',
    [],
    technicianController.createTechnician
);

router.put('/update', technicianController.updateTechnician);

router.delete('/delete', technicianController.deleteTechnician);

router.get('/list/:techId', technicianController.getTechnician);

router.get('/positions', technicianController.getTechnicianPositions);

router.post('/positions/create', technicianController.createTechnicianPosition)

module.exports = router;
