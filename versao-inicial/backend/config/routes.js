//Definição das rotas da aplicação
module.exports = app =>{
    app.route('/users')
    /*O consign faz a busca automatica dos arquivos necessarios 
    Não sendo necessario fazer o require do user para usar a função save*/
    .post(app.api.user.save)
    //rota do get para obter a lista de users do banco
    .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        //retorna o user ID 
        .get(app.api.user.getById)
    
    //rota de categoria 
    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save)

    app.route('/categories/:id')
        .get(app.api.category.getById)
        .put(app.api.category.save)
        .delete(app.api.category.remove)
}       