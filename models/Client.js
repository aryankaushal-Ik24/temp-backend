const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        trim:true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: false,
    }
},{timestamps:true});

module.exports = mongoose.model('Client', clientSchema);