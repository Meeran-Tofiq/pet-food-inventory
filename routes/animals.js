const express = require("express");
const router = express.Router();

// import controllers
const petFoodCategoryController = require("../controllers/petFoodCategoryController");
const petFoodInstanceController = require("../controllers/petFoodInstanceController");

// category routes

router.get("/", petFoodCategoryController.pet_food_category_list);

router.get("/create", petFoodCategoryController.pet_food_category_create_get);

router.post("/create", petFoodCategoryController.pet_food_category_create_post);

router.get(
	"/:id/update",
	petFoodCategoryController.pet_food_category_update_get
);

router.post(
	"/:id/update",
	petFoodCategoryController.pet_food_category_update_post
);

router.get(
	"/:id/delete",
	petFoodCategoryController.pet_food_category_delete_get
);

router.post(
	"/:id/delete",
	petFoodCategoryController.pet_food_category_delete_post
);

// instance routes

router.get("/:id/pet_foods", petFoodInstanceController.pet_food_instance_list);

router.get(
	"/:id/create",
	petFoodInstanceController.pet_food_instance_create_get
);

router.post(
	"/:id/create",
	petFoodInstanceController.pet_food_instance_create_post
);

router.get(
	"/:id/:instance_id",
	petFoodInstanceController.pet_food_instance_details
);

router.get(
	"/:id/:instance_id/update",
	petFoodInstanceController.pet_food_instance_update_get
);

router.post(
	"/:id/:instance_id/update",
	petFoodInstanceController.pet_food_instance_update_post
);

router.get(
	"/:id/:instance_id/delete",
	petFoodInstanceController.pet_food_instance_delete_get
);

router.post(
	"/:id/:instance_id/delete",
	petFoodInstanceController.pet_food_instance_delete_post
);

module.exports = router;
