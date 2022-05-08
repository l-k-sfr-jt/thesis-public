const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    offerNumber: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    partner: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    company: {
        name: {
            type: String,
            required: true
        },
        idNumber: {
            type: Number
        },
        taxNumber: {
            type: String
        }
    },
    copyTo: {
      type: String
    },
    scope: {
        type: String,
        required: true,
    },
    offerText: {
        type: String,
        required: true
    },
    supplier: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('Offer', offerSchema);