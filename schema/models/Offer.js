const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    nameOffer: {
        type: Number,
        required: true
    },
    reqHP: {
        type: Number,
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model("Offer", offerSchema);
