const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const technicianSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
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
    position: {
        type: 'ObjectId',
        ref: 'TechnicianPosition',
        required: true
    },
    taxInfo: {
        company: {
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
        },
        idNumber: {
            type: String,
            required: true
        },
        taxNumber: {
            type: String,
            required: true
        },
    },
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    rates: {
        hourRate: {
            type: 'Number',
            required: true,
            default: 0
        },
        car: {
            type: 'Number',
            required: true,
            default: 0
        },
        travel: {
            type: 'Number',
            required: true,
            default: 0
        }
    },

    projects: [{
        _id: false,
        projectId: {
            type: 'ObjectId',
            ref: 'Project',
        },
        workDays: [{
            _id: false,
            from: {
                type: Date
            },
            to: {
                type: Date
            }

        }]
    }]
});

module.exports = mongoose.model('Technician', technicianSchema);