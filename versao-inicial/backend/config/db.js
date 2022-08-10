//importa o arquivo de conexão com o banco
const config = require('../knexfile.js')
const knex = require('knex')(config)

//executa a migração (criação das tabelas ) no momento que sobe o backend
knex.migrate.latest([config])

//exportar para poder acessar o arquivo diretamente do index
module.exports = knex