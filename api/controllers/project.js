const Project = require('../models/project');
const Technician = require('../models/technician');
const mongoose = require('mongoose')
const {validationResult} = require('express-validator');
const imagesService = require("../utils/s3");

exports.getProject = (req, res, next) => {
    const projectId = req.params.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(200).json({message: 'Invalid project id.', project: {}});
        return;
    }
    Project.findOne({_id: projectId})
        .then(project => {
            if (!project) {
                const error = new Error('Could not find project.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Project fetched.', project: project});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getProjects = (req, res, next) => {
    const filter = req.query.projectIds ?
        {'_id': {$in: req.query.projectIds.projectId}}
        : {}
    Project.find(filter)
        .then(projects => {
            res.status(200).json({
                message: 'Projects fetched.',
                projects
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createProject = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const {name, dateFrom, dateTo, notes} = req.body.projectData;
    const orderer = {
        company: req.body.projectData.ordererCompany,
        name: req.body.projectData.ordererName,
        email: req.body.projectData.ordererEmail,
        phone: req.body.projectData.ordererPhone
    }
    const customer = {
        company: req.body.projectData.customerCompany,
        name: req.body.projectData.customerName,
        email: req.body.projectData.customerEmail,
        phone: req.body.projectData.customerPhone,
        street: req.body.projectData.customerStreet,
        city: req.body.projectData.customerCity,
        postalCode: req.body.projectData.customerPostalCode,
        country: req.body.projectData.customerCountry
    }
    const project = new Project({
        name,
        notes,
        dateFrom,
        dateTo,
        orderer,
        customer
    });
    project
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Project created successfully!',
                project: project
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.addTechToProject = (req, res, next) => {
    const {projectId, techId} = req.body.projectData;
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(techId)) {
        res.status(200).json({message: 'Invalid project or tech id.', project: {}});
        return;
    }
    const updateProject = Project.findByIdAndUpdate(projectId, {$push: {techniciansIds: techId}});
    const updateTech = Technician.findByIdAndUpdate(techId, {$push: {projects: {projectId: projectId}}});
    Promise.all([updateProject, updateTech]).then((values) => {
        res.status(200).json({
            message: 'Project and tech updated successfully!'
        });

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateProject = (req, res, next) => {
    const projectId = req.params.projectId;
    const project = req.body.project
    console.log(project);
    Project.findByIdAndUpdate(projectId, {...project})
        .then(result => {
            res.status(200).json({project: result});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.deleteProject = (req, res, next) => {
    const projectId = req.body.projectId;
    Project.findByIdAndRemove(projectId)
        .then(result => {
            res.status(201).json({
                message: 'Project deleted successfully!',
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.uploadFile = (req, res, next) => {
    const imageName = req.body.image;
    const contentType = req.body.contentType
    const splitName = imageName.split('/');
    const image = splitName[1];
    const projectId = splitName[0];
    let response;
    try {
        response = imagesService.upload(imageName, contentType);
    } catch (err) {
        console.error(`Error uploading image: ${err.message}`);
        return next(new Error(`Error uploading image: ${imageName}`));
    }
    Project.findByIdAndUpdate(projectId, {"$push": {"files": image}}, {"new": true, "upsert": true})
        .then((done, err) => {
            res.send({link: response, project: done});
        });
}

exports.getFile = (req, res, next) => {
    const imageName = req.query.pathToFile;
    let response;

    try {
        response = imagesService.download(imageName);
    } catch (err) {
        return next(new Error(`Error uploading image: ${imageName}`));
    }
    res.send({link: response});

}
