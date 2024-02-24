const petFoodCategory = require("../models/petFoodCategory");
const PetFoodInstance = require("../models/petFoodInstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs/promises");

const multer = require("multer");
const storage = multer.diskStorage({
	destination: "public/images/pet-food",
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
	},
});
const upload = multer({ storage });

exports.pet_food_instance_list = asyncHandler(async (req, res, next) => {
	const [category, petFoodInstances] = await Promise.all([
		petFoodCategory.findById(req.params.category_id).exec(),
		PetFoodInstance.find({
			category: req.params.category_id,
		}).exec(),
	]);

	const animalType = category.animal_type;

	res.render("pet_food_list", {
		title: `${animalType} Food List`,
		category,
		petFoodInstances,
	});
});

exports.pet_food_instance_details = asyncHandler(async (req, res, next) => {
	const petFood = await PetFoodInstance.findById(req.params.instance_id)
		.populate("category")
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
	upload.single("pet-food"),
	body("name", "Name must have at least 3 characters")
		.trim()
		.isLength(3)
		.escape(),
	body("category", "Animal must not be empty")
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
		const imageUrl = req.file.path.slice(6);

		const petFood = new PetFoodInstance({
			name: req.body.name,
			category: req.body.category,
			in_stock: req.body.in_stock,
			price: req.body.price,
			imageUrl,
		});

		if (!petFood) {
			res.redirect("/animals");
			return;
		}

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

	if (!petFood) {
		res.redirect("/animals");
		return;
	}

	res.render("pet_food_form", {
		title: "Update Pet Food",
		petFood,
		animalsList,
	});
});

exports.pet_food_instance_update_post = [
	upload.single("pet-food"),
	body("name", "Name must have at least 3 characters")
		.trim()
		.isLength(3)
		.escape(),
	body("category", "Animal must not be empty")
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

		let imageUrl;
		if (req.file) {
			imageUrl = req.file.path.slice(6);
		} else {
			const oldPetFood = await PetFoodInstance.findById(
				req.params.instance_id
			).exec();
			imageUrl = oldPetFood.imageUrl;
		}

		const petFood = new PetFoodInstance({
			name: req.body.name,
			category: req.body.category,
			in_stock: req.body.in_stock,
			price: req.body.price,
			_id: req.params.instance_id,
			imageUrl,
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

	await fs.unlink("public/" + petFood.imageUrl);
	await PetFoodInstance.findByIdAndDelete(req.body.pet_food_id).exec();
	res.redirect("../");
});
