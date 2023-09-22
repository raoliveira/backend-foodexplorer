const knex = require('../database/knex');

class IngredientsController {
  async showAll(request, response) {
    const { food_id } = request.params;

    const ingredients = await knex('ingredients').where({ food_id });

    return response.json(ingredients);
  }
}

module.exports = IngredientsController;
