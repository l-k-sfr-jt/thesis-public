const express = require('express');

const authController = require('../controllers/auth');
const {isAdmin} = require("../middleware/authJwt");

const router = express.Router();

router.post('/signin', authController.signIn);

router.get('/checkUser', authController.checkToken);

router.get('/logout', authController.logout)


module.exports = router;