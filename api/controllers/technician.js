const mongoose = require('mongoose');
const {validationResult} = require('express-validator');

const Technician = require('../models/technician');
const TechnicianPositon = require('../models/technicianPosition')

exports.getTechnicians = (req, res, next) => {
    const filter = req.query.techIds ?
        {'_id': {$in: req.query.techIds}}
        : {}
    Technician.find(filter)
        .populate('position')
        .select({'firstName': 1, 'lastName': 1, 'email': 1})
        .then(technicians => {
            res.status(200).json({
                message: 'Technicians fetched.',
                technicians
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getTechnician = (req, res, next) => {
    const techId = req.params.techId;
    if (!mongoose.Types.ObjectId.isValid(techId)) {
        res.status(200).json({message: 'Invalid technician id.', tech: {}});
        return;
    }
    Technician.findOne({_id: techId})
        .populate('position')
        .populate('projects.projectId', 'name customer.company')
        .then(tech => {
            if (!tech) {
                const error = new Error('Could not find technician.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Technician fetched.', tech: tech});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createTechnician = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const technician = new Technician(req.body.techData)
    technician
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Technician created successfully!',
                technician
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getTechnicianPositions = (req, res, next) => {
    TechnicianPositon.find()
        .then(positions => {
            res.status(200).json({
                message: 'Positions fetched.',
                positions
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createTechnicianPosition = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const {label} = req.body;
    const position = new TechnicianPositon({label});
    position
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Position created successfully!',
                position
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateTechnician = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const tech = req.body.techData;
    Technician.findOne({_id: tech._id}, {projects: {$elemMatch: {projectId: tech.projectId}}})
        .then(result => {
            if (!result) {
                res.status(404).send('Tech was not found');
                return;
            }

            result.projects[0].workDays = tech.workDays;
            result.save(function (err, result) {
                if (!err) {
                    //console.log(result)
                    res.status(200).send(result);
                } else {
                    res.status(400).send(err.message);
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteTechnician = (req, res, next) => {
    const {techId} = req.body;
    if (!mongoose.Types.ObjectId.isValid(techId)) {
        return res.status(200).json({message: 'Invalid technician id.'});
    }

    Technician.deleteOne({id: techId})
        .then(() => {
            return res.status(200).json({message: 'Tech deleted'});
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}
