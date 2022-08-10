/* Criação da tabela users*/
exports.up = function(knex, Promise) {
    //nome da tabela e colunas 
    return knex.schema.createTable('users',table=>{
        //campo de auto incremento  e chave primaria
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
};
