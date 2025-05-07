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
            labelName: {
                type: String,
                trim: true,
            },
            optionValues: [
                {
                    shopifyValue: {
                        type: String,
                        trim: true,
                    },
                    optionLabel: {
                        type: String,
                        trim: true,
                    },
                    id: {
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