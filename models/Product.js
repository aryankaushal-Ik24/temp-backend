const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    orgId: {
        type: String,
        required: true,
        trim: true,
    },
    directoryId: {
        type: String,
        required: true,
        trim: true,
    },
    sceneId: {
        type: String,
        required: true,
        trim: true,
    },
    shopifyProductId: {
        type: String,
        required: true,
        trim: true,
    },
    handleName: {
        type: String,
        required: true,
        trim: true,
    },
    options: [
        {
            optionName: {
                type: String,
                trim: true,
            },
            optionType: {
                type: String,
                enum: ['material', 'model'],
            },
            masterLabelName: {
                type: String,
                trim: true,
            },
            optionValues: [
                {
                    sOptionValueName: {
                        type: String,
                        trim: true,
                    },
                    mOptionValueName: {
                        type: String,
                        trim: true,
                    },
                    optionValueId: {
                        type: String,
                        trim: true,
                    },
                },
            ],
        },
    ],
}, { 
    timestamps: true,
    versionKey: false 
});

module.exports = mongoose.model('Product',productSchema);