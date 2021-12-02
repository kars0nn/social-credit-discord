const mongoose = require("mongoose");

const strikeSchema = mongoose.Schema({
    reason: {
        type:String,
        default: "No reason provided."
    },
    message:{
        type: String,
    },
    keyWord:{
        type: String
    },
    amount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    id: {
        type: String
    }
})

const userSchema = mongoose.Schema({
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
        default: "pfp url"
    },
    socialCredit: {
        type: Number,
        default: 0
    },
    strikes: [strikeSchema],
    isVIP: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("User", userSchema);
