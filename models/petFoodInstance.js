const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PetFoodInstance = new Schema(
	{
		name: { type: String, required: true },
		animal_type: {
			type: Schema.Types.ObjectId,
			ref: "PetFoodCategory",
			required: true,
		},
		in_stock: { type: Number, required: true },
		price: { type: Number, required: true },
	},
	{
		virtuals: {
			url: {
				get() {
					return "/animals/" + this.animal_type + "/" + this._id;
				},
			},
			isAvailable: {
				get() {
					return this.in_stock > 0;
				},
			},
		},
	}
);

module.exports = mongoose.model("PetFoodInstance", PetFoodInstance);
