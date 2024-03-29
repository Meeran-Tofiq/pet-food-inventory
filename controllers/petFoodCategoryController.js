const PetFoodCategory = require("../models/petFoodCategory");
const PetFoodInstance = require("../models/petFoodInstance");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const fs = require("fs/promises");

const multer = require("multer");
const storage = multer.diskStorage({
	destination: "public/images/animals",
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
	},
});
const upload = multer({ storage });

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
	upload.single("avatar"),
	body("animal_type", "Animal type must contain at least 3 characters.")
		.trim()
		.isLength({ min: 3 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const imageUrl = req.file.path.slice(6);

		const category = new PetFoodCategory({
			animal_type: req.body.animal_type,
			imageUrl,
		});

		if (!errors.isEmpty()) {
			console.log(category);
			res.render("category_form", {
				title: "Create Category",
				category,
				errors: errors.array(),
			});
			return;
		}

		await category.save();
		res.redirect("/animals");
	}),
];

exports.pet_food_category_update_get = asyncHandler(async (req, res, next) => {
	const category = await PetFoodCategory.findById(req.params.category_id);

	if (!category) {
		res.redirect("/animals");
		return;
	}

	res.render("category_form", {
		title: "Update Category",
		category,
	});
});

exports.pet_food_category_update_post = [
	upload.single("avatar"),
	body("animal_type", "Animal type must contain at least 3 characters.")
		.trim()
		.isLength({ min: 3 })
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		let imageUrl;
		if (req.file) {
			imageUrl = req.file.path.slice(6);
		} else {
			const oldCategory = await PetFoodCategory.findById(
				req.params.category_id
			).exec();
			imageUrl = oldCategory.imageUrl;
		}

		const category = new PetFoodCategory({
			animal_type: req.body.animal_type,
			imageUrl,
			_id: req.params.category_id,
		});

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Update Category",
				category,
				errors: errors.array(),
			});
			return;
		}

		await PetFoodCategory.findByIdAndUpdate(
			req.params.category_id,
			category,
			{}
		);
		res.redirect(category.url);
	}),
];

exports.pet_food_category_delete_get = asyncHandler(async (req, res, next) => {
	const [category, petFoodList] = await Promise.all([
		PetFoodCategory.findById(req.params.category_id).exec(),
		PetFoodInstance.find({ category: req.params.category_id }).exec(),
	]);

	if (!category) {
		res.redirect("/animals");
		return;
	}

	res.render("category_delete", {
		title: "Delete Category",
		category,
		petFoodList,
	});
});

exports.pet_food_category_delete_post = asyncHandler(async (req, res, next) => {
	const [category, petFoodList] = await Promise.all([
		PetFoodCategory.findById(req.params.category_id).exec(),
		PetFoodInstance.find({ category: req.params.category_id }).exec(),
	]);

	if (!category) {
		res.redirect("/animals");
		return;
	}

	if (petFoodList.length) {
		res.render("category_delete", {
			title: "Delete Category",
			category,
			petFoodList,
		});
		return;
	}

	await fs.unlink("public/" + category.imageUrl);
	await PetFoodCategory.findByIdAndDelete(req.body.category_id).exec();
	res.redirect("/animals");
});
