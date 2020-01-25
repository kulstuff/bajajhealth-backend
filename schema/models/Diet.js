const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dietSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metric: {
        type: String
    },
    type: {
        type: Number,
        required: true
    },
    name: {
        type: String
    },
    quantity: {
        type: Number
    },
    calorie: {
        type: Number
    },
    // name: [
    //     {
    //         type: String
    //     }
    // ],
    // quantity: [
    //     {
    //         type: Number
    //     }
    // ],
    // calorie: [
    //     {
    //         type: Number
    //     }
    // ],
    calorieSum: {
        type: Number
    }
});

module.exports = mongoose.model("Diet", dietSchema);
