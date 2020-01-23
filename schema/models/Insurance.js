const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const insuranceSchema = new Schema({
    nameInsurance: {
        type: Number,
        required: true
    },
    reqBP: {
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

module.exports = mongoose.model("Insurance", insuranceSchema);
