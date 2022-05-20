// import module `mongoose`
const mongoose = require('mongoose');

// defines the schema for collection `Item`

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Condiments', 'Supplies', 'Pasalubong',
            'Cooking Supplies', 'Market Item', 'Drinks', 'Frozen Goods'],
    },
    itemPrice: {
        type: Number,
    },
    beginningValue: {
        type: Number,
        required: true,
        default: 0,
    }, // leftovers
    delivery: {
        type: Number,
        required: true,
    }, // delivered today
    totalStart: {
        type: Number,
        required: true,
    }, // leftovers + delivered
    totalReleased: {
        type: Number,
        required: true,
        default: 0,
    },
    pullout: {
        type: Number,
        required: true,
        default: 0,
    },
    totalEnd: {
        type: Number,
        required: true,
        default: 0,
    },
    physicalCount: {
        type: Number,
        required: true,
        default: 0,
    },
    difference: {
        type: Number,
        required: true,
        default: 0,
    },
    match: {
        type: Boolean,
    },
    notes: {
        type: String,
    },
    availability: {
        type: Boolean,
        default: false,
    },
    branch: {
        type: [String],
        required: true,
        default: [],
    },
    quantity: {
        type: [Number],
        required: true,
        default: [],
    },
});

module.exports = mongoose.model('Item', itemSchema);
