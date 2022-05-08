const mongoose = require('mongoose')
const {validationResult} = require('express-validator');
const Offer = require('../models/offer');
const {createOffer} = require("../utils/pdfGenerator");
const path = require("path");

exports.getOffer = (req, res, next) => {
    const offerId = req.params.offerId;
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
        res.status(200).json({message: 'Invalid offer id.', offer: null});
        return;
    }
    Offer.findOne({_id: offerId})
        .then(offer => {
            if (!offer) {
                const error = new Error('Could not find the offer.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Offer fetched.', offer: offer});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getOffers = (req, res, next) => {
    Offer.find()
        .then(offers => {
            res.status(200).json({
                message: 'Offers fetched.',
                offers
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createOffer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        console.log(errors)
        throw error;
    }
    const {offerNumber, date, copyTo, scope, offerText} = req.body.offerData;
    const partner = {
        name: req.body.offerData.partnerName,
        email: req.body.offerData.partnerEmail,
        phone: req.body.offerData.partnerPhone,
    };
    const company = {
        name: req.body.offerData.companyName,
        idNumber: req.body.offerData.idNumber,
        taxNumber: req.body.offerData.taxNumber,
    };
    const supplier = {
        phone: 'TODO',
        email: 'TODO@TODO.COM',
        name: 'TODO TODO'
    };
    const offer = new Offer({
        offerNumber,
        date,
        partner,
        copyTo,
        company,
        supplier,
        scope,
        offerText
    });
    offer
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Offer created successfully!',
                offer: offer
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
    const offerId = req.params.offerId;
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
        res.status(200).json({message: 'Invalid offer id.'});
        return;
    }

    Offer.findOne({_id: offerId})
        .then(async offer => {
            if (!offer) {
                const error = new Error('Could not find the offer.');
                error.statusCode = 404;
                throw error;
            }
            const offerPath = path.join('data', 'offers', `offer-${offerId}.pdf`);
            await createOffer(offer, offerPath);
            res.download(offerPath);

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.deleteOffer = (req, res, next) => {
    const offerId = req.body.offerId;
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
        res.status(200).json({message: 'Invalid offer id.'});
        return;
    }
    Offer.findByIdAndRemove(offerId)
        .then(result => {
            res.status(201).json({
                message: 'Offer deleted successfully!',
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateOffer = (req, res, next) => {
    const offerId = req.params.offerId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const {offerNumber, date, partner, copyTo, company, scope, offerText} = req.body.offer;
    Offer.findById(offerId)
        .then(offer => {
            if (!offer) {
                const error = new Error('Could not find offer.');
                error.statusCode = 404;
                throw error;
            }
            offer.offerNumber = offerNumber;
            offer.date = date;
            offer.partner = partner;
            offer.copyTo = copyTo;
            offer.company = company;
            offer.scope = scope;
            offer.offerText = offerText;
            return offer.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Offer updated!', order: result });
        })

};

