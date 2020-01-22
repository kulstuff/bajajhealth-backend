const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metricSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: String,
		required: true
	},
	bpm: {
		type: Number
	},
	calories: {
		type: Number,
		required: true
	},
	steps: {
		type: Number,
		required: true
	},
	clinicalData: [
		{
			type: Schema.Types.ObjectId,
			ref: "ClinicalData"
		}
	],
	diets: [{
		type: Schema.Types.ObjectId,
		ref: 'Diets'
	}],
});

module.exports = mongoose.model("Metric", metricSchema);
