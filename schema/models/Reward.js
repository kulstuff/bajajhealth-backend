const mongoose = require("mongoose")
const Schema = mongoose.Schema

const rewardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    challenge: {
        type: Schema.Types.ObjectId,
        ref: 'Challenge'
    },
    addHp: {
        type: Number,
        required: true
    },
    addBp: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Reward", rewardSchema)
