//Definição das rotas da aplicação
module.exports = app =>{
    app.route('/users')
    /*O consign faz a busca automatica dos arquivos necessarios 
    Não sendo necessario fazer o require do user para usar a função save*/
    .post(app.api.user.save)
}