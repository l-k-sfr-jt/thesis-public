const mongoose = require('mongoose')
const {validationResult} = require('express-validator');

const Order = require('../models/order');
const path = require("path");
const {createOffer, createOrder} = require("../utils/pdfGenerator");

exports.getOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(200).json({message: 'Invalid order id.', order: {}});
        return;
    }
    Order.findOne({_id: orderId})
        .then(order => {
            if (!order) {
                const error = new Error('Could not find the order.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Order fetched.', order: order});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find()
        .then(orders => {
            res.status(200).json({
                message: 'Orders fetched.',
                orders
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getOrdersFor = (req, res, next) => {
    const techId = req.params.techId;
    if (!mongoose.Types.ObjectId.isValid(techId)) {
        res.status(200).json({message: 'Invalid tech id.', order: {}});
        return;
    }
    Order.find({technician: techId})
        .select({orderNumber: 1, projectName: 1, date: 1})
        .then(orders => {
            if (!orders) {
                const error = new Error('Could not find any orders.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Orders fetched.', orders});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const {orderNumber, date, copyTo, projectName, orderText, technician} = req.body.orderData;
    const supplier = {
        name: req.body.orderData.name,
        idNumber: req.body.orderData.idNumber,
        email: req.body.orderData.email,
        phone: req.body.orderData.phone,
        address: {
            street: req.body.orderData.street,
            postalCode: req.body.orderData.postalCode,
            city: req.body.orderData.city,
            country: req.body.orderData.country
        },
    };
    const customer = {
        phone: 'TODO',
        email: 'TODO@TODO.COM',
        name: 'TODO TODO'
    };
    const order = new Order({
        orderNumber,
        date,
        supplier,
        copyTo,
        customer,
        projectName,
        orderText,
        technician
    });
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created successfully!',
                order: order
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.exportToPDF = (req, res, next) => {
    const orderId = req.params.offerId;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(200).json({message: 'Invalid order id.'});
        return;
    }

    Order.findOne({_id: orderId})
        .then(async order => {
            if (!order) {
                const error = new Error('Could not find the order.');
                error.statusCode = 404;
                throw error;
            }
            const orderPath = path.join('data', 'orders', `order-${orderId}.pdf`);
            await createOrder(order, orderPath);
            res.download(orderPath);

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.deleteOrder = (req, res, next) => {
    const orderId = req.body.orderId;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(200).json({message: 'Invalid order id.'});
        return;
    }
    Order.findByIdAndRemove(orderId)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order deleted successfully!',
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const {orderNumber, date, supplier, copyTo, customer, projectName, orderText, technician} = req.body.order;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                const error = new Error('Could not find order.');
                error.statusCode = 404;
                throw error;
            }
            order.orderNumber = orderNumber;
            order.date = date;
            order.supplier = supplier;
            order.copyTo = copyTo;
            order.customer = customer;
            order.projectName = projectName;
            order.orderText = orderText;
            order.technician = technician;
            return order.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Order updated!', order: result });
        })

};
