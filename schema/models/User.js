const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    healthIndex: {
        type: Number,
    },
    bmi: {
        type: Number,
    },
    diets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Diet'
        }
    ],
    bp: {
        type: Number,
    },
    hp: {
        type: Number,
    },
    height: {
        type: Number
    },
    weight: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        required: true
    },
    metrics: [
        {
            type: Schema.Types.ObjectId,
            ref: "Metric"
        }
    ],
    challenges: [
        {
            type: Schema.Types.ObjectId,
            ref: "Challenge"
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    gToken: {
        type: String
    },
    displayPicture: {
        type: Number,
        required: true
    },
    rewards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reward"
        }
    ],
    insurances: [
        {
            type: Schema.Types.ObjectId,
            ref: "Insurance"
        }
    ],
    offers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Offer"
        }
    ],
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema)
