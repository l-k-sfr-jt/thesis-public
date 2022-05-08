const express = require('express');
const {body} = require('express-validator');

const projectController = require('../controllers/project');
const imagesService = require('../utils/s3')

const router = express.Router();

router.get('/list', projectController.getProjects);

router.get('/list/:projectId', projectController.getProject);

router.post(
    '/create',
    [],
    projectController.createProject);

router.post('/addTech', projectController.addTechToProject);

router.put('/update/:projectId', projectController.updateProject);

router.delete('/delete', projectController.deleteProject);

router.post('/upload/:projectId', projectController.uploadFile);

router.get('/download', projectController.getFile)

module.exports = router;