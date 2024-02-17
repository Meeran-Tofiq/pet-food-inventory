const PetFoodCategory = require("../models/petFoodCategory");
const asyncHandler = require("express-async-handler");

exports.pet_food_category_list = asyncHandler(async (req, res, next) => {
	const categoriesList = await PetFoodCategory.find({}).exec();

	res.render("animals_list", {
		title: "Animals",
		categoriesList,
	});
});

exports.pet_food_category_create_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

exports.pet_food_category_create_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED YET");
});

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
