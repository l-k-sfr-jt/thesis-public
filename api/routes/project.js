const express = require('express');
const {body} = require('express-validator');

const projectController = require('../controllers/project');
const authJwt = require('../middleware/authJwt');
const imagesService = require('../utils/s3');

const router = express.Router();

router.get('/list',  [authJwt.verifyToken, authJwt.isAdmin], projectController.getProjects);

router.get('/list/:projectId', [authJwt.verifyToken, authJwt.isAdmin], projectController.getProject);

router.post(
    '/create',
    [],
    projectController.createProject);

router.post('/addTech', [authJwt.verifyToken, authJwt.isAdmin], projectController.addTechToProject);

router.put('/update/:projectId', [authJwt.verifyToken, authJwt.isAdmin], projectController.updateProject);

router.delete('/delete', [authJwt.verifyToken, authJwt.isAdmin], projectController.deleteProject);

router.post('/upload/:projectId', [authJwt.verifyToken, authJwt.isAdmin], projectController.uploadFile);

router.get('/download', [authJwt.verifyToken, authJwt.isAdmin], projectController.getFile)

module.exports = router;