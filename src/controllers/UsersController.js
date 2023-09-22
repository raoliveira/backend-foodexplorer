const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const knex = require("../database/knex");


class UsersController {
    
    async create(request, response) {
        
        const { name, email, password, isAdmin = false } = request.body
        const checkUserExist = await knex("users").where({email}).first();

        if (checkUserExist) {
             throw new AppError("Este e-mail já está em uso!");
        }
        
        const hashedPassword = await hash(password, 8)

        await knex("users").insert(
            {
                name,
                email,
                password: hashedPassword, 
                isAdmin
            })
        return response.status(201).json({} )

    }

    async update(request, response) {
        const { name, email, password, old_password, isAdmin } = request.body
        
        const user_id = request.user.id;
        //const { id } = request.params

        
        const user = await knex("users").where( { id: user_id } ).first()
        //console.log('user ', user);

        if (!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = await knex("users").whereNot({ id: user_id }).andWhere({ email }).first()

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso!");
        }

        user.name  = name ?? user.name;
        user.email = email ?? user.email;
        user.isAdmin = isAdmin ?? user.isAdmin;

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha.")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.");
            }

            user.password = await hash(password, 8)
        }

        await knex("users").where({ id: user_id }).update({
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            updated_at: knex.raw("DATETIME('now')"),
          })

        return response.status(200).json({ "message": "Atualizado com sucesso"})    ;
    }


}

module.exports = UsersController;