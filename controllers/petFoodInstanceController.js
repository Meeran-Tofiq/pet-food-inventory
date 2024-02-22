const petFoodCategory = require("../models/petFoodCategory");
const PetFoodInstance = require("../models/petFoodInstance");
const asyncHandler = require("express-async-handler");

exports.pet_food_instance_list = asyncHandler(async (req, res, next) => {
	const [category, petFoodInstances] = await Promise.all([
		petFoodCategory.findById(req.params.category_id).exec(),
		PetFoodInstance.find({
			animal_type: req.params.category_id,
		})
			.populate()
			.exec(),
	]);

	console.log("category is " + category.animal_type);
	const animalType = category.animal_type;

	res.render("pet_food_list", {
		title: `${animalType} Food List`,
		petFoodInstances,
	});
});

exports.pet_food_instance_details = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_instance_create_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_instance_create_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_instance_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_instance_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_instance_delete_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_instance_delete_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});
