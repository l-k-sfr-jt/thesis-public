const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require('../models/user');

signToken = id => {
    return jwt.sign({ id }, config.secret, {
        expiresIn: 86400 // 24 hours
    });
}

exports.verifyToken = (req, res, next) => {
    let token = req.cookies.jwt
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

exports.createUserToken = async(user, req, res) => {
    const jwt = signToken(user._id);

    //set expiry to 1 month
    let d = new Date();
    d.setDate(d.getDate() + 30);

    //cookie settings
    res.cookie('jwt', jwt, {
        expires: d,
        httpOnly: true,
        sameSite: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    //remove user password from output
    user.password = undefined;
    res.status(200).json({
        message: 'User logged in',
        data: {
            jwt,
            user
        }
    });
};

exports.isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (user.role === 'admin') {
            next();
            return;
        }
        res.status(403).send({message: "Require Admin Role!"});
    });
};