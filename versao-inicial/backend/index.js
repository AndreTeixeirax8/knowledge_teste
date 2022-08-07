const app =require('express') ()
const consign = require('consign')  

consign()//facilita o gerenciamento das dependencias
        .then('./config/middlewares.js')
        .into(app) //injeta em cada dependencia o app 

app.listen(3000,()=>{
    console.log('Backend executando...')
});