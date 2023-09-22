const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class CategoriesController {

    async create(request, response) {
        const { name } = request.body
        
        if (!name) {
            throw new AppError("Nome da categoria não foi informado");
        }
        
        const checkCategoryExist = await knex("categories").where({ name }).first()
        if (checkCategoryExist) {
            throw new AppError("Categoria já cadastrada.")
        }

        await knex("categories").insert({ name });

        return response.status(201).json({name})

    }

    async delete(request, response) {
        const { id } = request.params
        console.log(id);
        await knex("categories").where({id}).first().del();

        return response.json({"message":"deletado com sucesso"})
    }

    async update(request, response) {
        const { id } = request.params
        const { name } = request.body
        console.log(id);
        const category = await knex("categories").where({ id }).first();
        
        if (!category) {
            throw new AppError("Categoria não cadastrada!")
        }

        const checkCategoryExist = await knex("categories").where({ name }).first();
        if (checkCategoryExist) {
            throw new AppError("Já existe uma categoria com este nome!")
        }

        category.name = name
        await knex("categories").where({ id }).update({ 
            name: category.name,
            created_at: category.updated_at,
            updated_at: knex.raw("DATETIME('now')"),

            
        })

        return response.json({name})
    
    }

    async index(request, response) {
        
        const categories = await knex("categories")
        console.log(categories);
        return response.status(200).json(categories)

    }

    async show(request, response) {
        const {id } = request.params
        const [category] = await knex("categories").where({id})

        return response.status(200).json(category)

    }
}

module.exports = CategoriesController;