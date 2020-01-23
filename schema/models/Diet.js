const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dietSchema = new Schema({
    metric: {
        type: Schema.Types.ObjectId,
        ref: 'Metric',
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    name: [
        {
            type: String,
            required: true
        }
    ],
    quantity: [
        {
            type: Number
        }
    ],
    calorie: [
        {
            type: Number
        }
    ],
    calorieSum: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Diet", dietSchema);
