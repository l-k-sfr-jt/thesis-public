const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: 'Users fetched.',
                users
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(200).json({message: 'Invalid user id.', user: {}});
        return;
    }
    User.findOne({_id: userId})
        .then(user => {
            if (!user) {
                const error = new Error('Could not find user.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'User fetched.', user: user});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 8);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role
    const user = new User({
        email,
        password,
        firstName,
        lastName,
        role
    });
    user
        .save()
        .then(result => {
            res.status(201).json({
                message: 'User created successfully!',
                user: user
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
