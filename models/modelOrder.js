
// import module `mongoose`
const mongoose = require('mongoose');

// defines the schema for collection `Order`

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users',
        required: true,
    },
    userDetails: {
        type: Object,
        reuired: true,
    },
    cart: {
        type: Object,
        required: true,
    },
    deliverTo: {
        type: String,
    },
    deliverFrom: {
        type: String,
    },
    dateOrdered: {
        type: Date,
    },
    dateOrderedType: {
        type: String,
    },
    dateConfirmed: {
        type: Date,
    },
    dateConfirmedType: {
        type: String,
    },
    dateReceived: {
        type: Date,
    },
    dateReceivedType: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Received', 'Cancelled'],
    },
    allItems: {
        type: Object,
    },
    branch: {
        type: String,
    },


});

module.exports = mongoose.model('Order', OrderSchema);
