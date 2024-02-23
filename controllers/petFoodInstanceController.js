const petFoodCategory = require("../models/petFoodCategory");
const PetFoodInstance = require("../models/petFoodInstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
	const petFood = await PetFoodInstance.findById(req.params.instance_id)
		.populate("animal_type")
		.exec();

	res.render("pet_food_detail", { title: petFood.name, petFood });
});

exports.pet_food_instance_create_get = asyncHandler(async (req, res, next) => {
	const animalsList = await petFoodCategory.find({}).exec();

	res.render("pet_food_form", {
		title: "Create Pet Food",
		animalsList,
	});
});

exports.pet_food_instance_create_post = [
	body("name", "Name must have at least 3 characters")
		.trim()
		.isLength(3)
		.escape(),
	body("animal_type", "Animal must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("in_stock", "Stock must be a valid number")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("price", "Price must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const petFood = new PetFoodInstance({
			name: req.body.name,
			animal_type: req.body.animal_type,
			in_stock: req.body.in_stock,
			price: req.body.price,
		});

		if (!errors.isEmpty()) {
			const animalsList = await petFoodCategory.find({}).exec();

			res.render("pet_food_form", {
				title: "Create Pet Food",
				animalsList,
				petFood,
				errors: errors.array(),
			});
			return;
		}

		await petFood.save();
		res.redirect(petFood.url);
	}),
];

exports.pet_food_instance_update_get = asyncHandler(async (req, res, next) => {
	const [petFood, animalsList] = await Promise.all([
		PetFoodInstance.findById(req.params.instance_id).exec(),
		petFoodCategory.find({}).exec(),
	]);

	console.log(petFood);

	res.render("pet_food_form", {
		title: "Update Pet Food",
		petFood,
		animalsList,
	});
});

exports.pet_food_instance_update_post = [
	body("name", "Name must have at least 3 characters")
		.trim()
		.isLength(3)
		.escape(),
	body("animal_type", "Animal must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("in_stock", "Stock must be a valid number")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("price", "Price must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const petFood = new PetFoodInstance({
			name: req.body.name,
			animal_type: req.body.animal_type,
			in_stock: req.body.in_stock,
			price: req.body.price,
			_id: req.params.instance_id,
		});

		if (!errors.isEmpty()) {
			const animalsList = await petFoodCategory.find({}).exec();

			res.render("pet_food_form", {
				title: "Update Pet Food",
				animalsList,
				petFood,
				errors: errors.array(),
			});
			return;
		}

		await PetFoodInstance.findByIdAndUpdate(
			req.params.instance_id,
			petFood,
			{}
		);
		res.redirect(petFood.url);
	}),
];

exports.pet_food_instance_delete_get = asyncHandler(async (req, res, next) => {
	const petFood = await PetFoodInstance.findById(
		req.params.instance_id
	).exec();

	if (!petFood) {
		res.redirect("/animals");
		return;
	}

	res.render("pet_food_delete", {
		title: "Delete Pet Food",
		petFood,
	});
});

exports.pet_food_instance_delete_post = asyncHandler(async (req, res, next) => {
	const petFood = await PetFoodInstance.findById(
		req.params.instance_id
	).exec();

	if (!petFood) {
		res.redirect("/animals");
		return;
	}

	await PetFoodInstance.findByIdAndDelete(req.body.pet_food_id).exec();
	res.redirect("../");
});
