const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const technicianPositionSchema = new Schema({
    label: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('TechnicianPosition', technicianPositionSchema);