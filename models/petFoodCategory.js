const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PetFoodCategory = new Schema(
	{
		animal_type: { type: String, required: true },
	},
	{
		virtuals: {
			url: {
				get() {
					return "/animals/" + this._id + "/pet_foods";
				},
			},
			image: {
				get() {
					return "";
				},
			},
		},
	}
);

module.exports = mongoose.model("PetFoodCategory", PetFoodCategory);
