const { Router, response } = require("express");

const FoodsController = require("../controllers/FoodsController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const multer = require('multer');
const uploadConfig = require('../configs/upload');
const upload = multer(uploadConfig.MULTER);

const foodsRoutes = Router();

const foodsController = new FoodsController()

foodsRoutes.use(ensureAuthenticated);

foodsRoutes.post('/', upload.single('image'), foodsController.create);
foodsRoutes.put('/:id', upload.single('image'), foodsController.update);
foodsRoutes.delete('/:id', foodsController.delete);
foodsRoutes.get('/:id', foodsController.show);
foodsRoutes.get('/', foodsController.showAll);


module.exports = foodsRoutes