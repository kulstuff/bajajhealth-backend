const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reward: {
        type: Schema.Types.ObjectId,
        ref: "Reward",
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Challenge", challengeSchema);
