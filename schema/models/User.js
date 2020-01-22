const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
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
    activities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }
    ],
    challenges: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Challenge'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    displayPicture: {
        type: Number,
        required: true
    },
    rewards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reward'
        }
    ],
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)