exports.up =  knex => knex.schema.createTable("foods", table => { 
    table.increments("id");
    table.text("name");
    table.text("description");
    table.decimal("price", 10, 2);
    table.text("image");
    table.integer("user_id").references("id").inTable("users");
    //table.integer("category_id").references("id").inTable("categories");
    table.text('category');
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());

});

exports.down = knex => knex.schema.dropTable("foods");

