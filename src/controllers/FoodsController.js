const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const DiskStorage = require('../providers/DiskStorage');

class FoodsController {

    async create(request, response) {
    
        const { name, price, description, category, ingredients } = request.body;
        const dishFilename = request.file.filename;
        const diskStorage = new DiskStorage();
        //const { user_id } = request.query
        const user_id = request.user.id;

        if (!dishFilename) {
            throw new AppError('A imagem é um campo obrigatório!');
          }

        if (!name) {
            throw new AppError("Campo nome é de preenchimento obrigatório!")
        }

        if (!description) {
            throw new AppError("Campo de descrição é de preenchimento obrigatório!")
        }
        if (!price) {
            throw new AppError("Campo de preço é de preenchimento obrigatório!")
        }
        // if (!category_id && !category_name) {
        //     throw new AppError("Campo de categoria é de preenchimento obrigatório!")
        // }

        // if (!category_id) {

        //     const category = await knex("categories").whereRaw(`LOWER(name) LIKE ?`, [category_name.toLowerCase()]).first()
        //     console.log(category);

        //     if (!category) {
        //         category = await knex("categories").insert({ category_name })
        //         category_id = category.id
        //     }
        // }
        const checkFoodExist = await knex("foods").where({ name }).first();

        if (checkFoodExist) {
            throw new AppError("Já existe prato cadastrado com este nome.")
        }
        const filename = await diskStorage.saveFile(dishFilename);

        const [food_id] = await knex("foods").insert(
            {
                name,
                description,
                price,
                user_id,
                category,
                image: filename,
                created_at: knex.raw("DATETIME('now')"),
                updated_at: knex.raw("DATETIME('now')"),

            });


        if (ingredients) {
            if (ingredients.length >= 0) {
                if (Array.isArray(ingredients)) {
                    const ingredientsInsert = ingredients.map((ingredient) => {
                        return {
                            food_id,
                            name: ingredient,
                        };
                    });

                    await knex('ingredients').insert(ingredientsInsert);
                } else {
                    await knex('ingredients').insert({
                        food_id,
                        name: ingredients,
                    });
                }
            }

        }
    return response.json('Prato criado com sucesso.');

    }

    async update(request, response) {
        const { id } = request.params;
        const { name, price, description, category, ingredients } = request.body;
        const foodIngredients = JSON.parse(ingredients);

        const food = await knex('foods').where({ id }).first();
        if (!food) {
            throw new AppError('O prato não foi encontrado.');
        }

        if (request.file) {
            const foodFilename = request.file.filename;
            const diskStorage = new DiskStorage();

            if (foodFilename) {
                
                if (food.image !== null && food.image !== undefined) {
                    await diskStorage.delete(food.image);
                }
                const filename = await diskStorage.saveFile(foodFilename);
                food.image = filename;


            }
        }

        food.name = name ?? food.name;
        food.price = price ?? food.price;
        food.description = description ?? food.description;
        food.category = category ?? food.category;

        await knex('foods').where({ id }).update({
            name: food.name,
            price: food.price,
            description: food.description,
            image: food.image,
            category: food.category,
            updated_at: knex.fn.now(),
        });
        const ingredientsInsert = foodIngredients.map(ingredient => {
            return {
                food_id: id,
                name: ingredient.name || ingredient
            };
        });
        await knex('ingredients').where('food_id', id).delete();

        await knex('ingredients').insert(ingredientsInsert);

        return response.json('As alterações foram salvas com sucesso.');
    }

    async delete(request, response) {
        const { id } = request.params;
    
        const food = await knex('foods').where({ id }).first();
        if (!food) {
          throw new AppError('O prato não foi encontrado.');
        }
    
        await knex('foods').where({ id }).delete();
    
        return response.json('O prato foi excluído com sucesso.');
    }
    
    async show(request, response) {
        const { id } = request.params;
    
        const food = await knex('foods').where({ id }).first();
        if (!food) {
          throw new AppError('O prato não foi encontrado.');
        }
    
        return response.json(food);
    }
    
    async showAll(request, response) {
        const { name } = request.query;
        
        let foods;
    
        if (name) {
          foods = await knex('ingredients')
            .select([
              'foods.id',
              'foods.name',
              'foods.price',
              'foods.description',
              'foods.image',
              'ingredients.name',
              'foods.category'
            ])
            .whereLike('foods.name', `%${name}%`)
            .orWhereLike('ingredients.name', `%${name}%`)
            .innerJoin('foods', 'foods.id', 'ingredients.food_id')
            .groupBy('foods.id');
        } else {
          foods = await knex('foods');
        }
    
        return response.json(foods);
    }
}

module.exports = FoodsController;
