const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    },
    orderer: {
        company: {
            type: String,
            required: true
        },
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
    customer: {
        company: {
            type: String,
            required: true
        },
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
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }

    },
    files: [{
        type: String
    }],
    status: {
        type: String,
        required: true,
        default: 'reserved'
    },
    // offer: {
    //     type: 'ObjectId',
    //     ref: 'Offer'
    // },
    techniciansIds: [{
            type: 'ObjectId',
            ref: 'Technician'
    }]

});

module.exports = mongoose.model('Project', projectSchema);