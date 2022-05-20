
// import module `mongoose`
const mongoose = require('mongoose');

// defines the schema for collection `Users`
const UserSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: ['Co-administrator', 'Franchisee', 'Commissary', 'Master Admin'],
    },
    fullName: {
        type: {
            firstName: String,
            lastName: String,
        },
        required: true,
    },
    branchName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    completeAddress: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    city: {
        type: String,
    },
    email: {
        type: String,
    },

    newUser: {
        type: Boolean,
    },


});

module.exports = mongoose.model('User', UserSchema);
