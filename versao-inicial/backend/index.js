const app = require('express') ()
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')


//aqui tem o knex já configurado
app.db = db
app.mongoose = mongoose

consign()/*Facilita o gerenciamento das dependencias 
          Aqui o consign le as dependencias que o app precisa.*/
        .include('./config/passport.js') 
        .then('./config/middlewares.js')
        .then('./api/validation.js')
        .then('./api')
        .then('./schedule')
        .then('./config/routes.js')
        .into(app) //injeta em cada dependencia o app 

app.listen(3000,()=>{
    console.log('Backend executando...')
});