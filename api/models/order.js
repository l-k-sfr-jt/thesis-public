const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    supplier: {
        name: {
            type: String,
            required: true
        },
        idNumber: {
            type: Number,
            required: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            country: {
                type: String
            }
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
        }
    },
    copyTo: {
        type: String,
        required: false
    },
    customer: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    projectName: {
        type: String,
        required: true,
    },
    orderText: {
        type: String,
        required: true
    },
    technician: {
        type: 'ObjectId',
        ref: 'Technician',
    }
});

module.exports = mongoose.model('Order', orderSchema);