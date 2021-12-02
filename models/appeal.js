const mongoose = require("mongoose");

const appealSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    socialCredit: {
        type: Number
    },
    appeal: {
        type: String,
        default: 'no message provided'
    },
    isVIP: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    id:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Appeal", appealSchema);