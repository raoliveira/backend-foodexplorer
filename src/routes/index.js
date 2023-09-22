const { Router } = require("express")

const usersRouter = require('./users.routes');
const categoriesRoutes = require('./categories.routes');
const foodsRoutes = require("./foods.routes");
const sessionsRoutes = require("./sessions.routes");
const ingredientsRoutes = require("./ingredients.routes");

const routes = Router();


routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes)
routes.use("/categories", categoriesRoutes)
routes.use("/foods", foodsRoutes)
routes.use("/ingredients", ingredientsRoutes);

module.exports = routes;

