const express = require('express');
const {body} = require('express-validator');

const usersController = require('../controllers/users');
const authJwt = require("../middleware/authJwt");

const router = express.Router();

// GET /feed/posts
router.get('/list', usersController.getUsers);

// POST /feed/post
router.post(
    '/create',
    [authJwt.verifyToken, authJwt.isAdmin],
    [
        body('firstName')
            .trim()
            .isLength({min: 2}),
        body('lastName')
            .trim()
            .isLength({min: 1}),
        body('email')
            .isEmail(),
        body('password')
            .trim()
            .isLength({min: 8}),
    ],
    usersController.createUser
);

router.get('/list/:userId', [authJwt.verifyToken, authJwt.isAdmin], usersController.getUser);

module.exports = router;
