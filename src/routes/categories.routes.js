const { Router, response } = require("express");

const CategoriesController = require('../controllers/CategoriesController')

const categoriesRoutes = Router();

const categoriesController = new CategoriesController();

categoriesRoutes.get("/", categoriesController.index)
categoriesRoutes.get("/:id", categoriesController.show)

categoriesRoutes.post("/", categoriesController.create)
categoriesRoutes.delete("/:id", categoriesController.delete)
categoriesRoutes.put("/:id", categoriesController.update)


module.exports = categoriesRoutes;