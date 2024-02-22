const PetFoodCategory = require("../models/petFoodCategory");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.pet_food_category_list = asyncHandler(async (req, res, next) => {
	const categoriesList = await PetFoodCategory.find({}).exec();

	res.render("animals_list", {
		title: "Animals",
		categoriesList,
	});
});

exports.pet_food_category_create_get = asyncHandler(async (req, res, next) => {
	res.render("category_form", {
		title: "Create Category",
	});
});

exports.pet_food_category_create_post = [
	body("animal_type", "Animal type must contain at least 3 characters.")
		.trim()
		.isLength(3)
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const category = new PetFoodCategory({
			animal_type: req.body.animal_type,
		});

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Create Category",
				category,
				errors: errors.array(),
			});
			return;
		}

		await category.save();
		res.redirect(category.url);
	}),
];

exports.pet_food_category_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_category_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_category_delete_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_category_delete_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});
