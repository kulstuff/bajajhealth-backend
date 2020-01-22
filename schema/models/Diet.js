const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dietSchema = new Schema({
    metric: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    nameFood: [
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
    calorieAdd: {
        type: Number,
    }
});

module.exports = mongoose.model("Diet", dietSchema);
