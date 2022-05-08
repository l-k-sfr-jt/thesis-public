const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require('../middleware/authJwt');
const config = require("../config/auth.config");
const {promisify} = require('util');

const User = require('../models/user');


exports.signIn = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (!user) {
            return res.status(404).send({message: "User Not found."});
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        auth.createUserToken(user, req, res);
    });
};

exports.checkToken = async (req, res, next) => {
    let user;
    console.log(req.cookies);
    if (req.cookies.jwt){
        const token = req.cookies.jwt;
        const decoded = await promisify(jwt.verify)(token, config.secret);
        user = await User.findById(decoded.id);
    } else {
        user = null;
    }

    res.status(200).send({user});
};

exports.logout = async (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    });
    res.status(200).send('user is logged out');
};
