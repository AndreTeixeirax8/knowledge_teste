/*Definição das rotas da aplicação
Tomar cuidado na rotas mantes sempre a rota pricipla na frente
das outras que vão receber um parametro como id */

module.exports = app =>{

    //rotas de autenticação
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

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

     app.route('/categories/tree')
        .get(app.api.category.getTree)
        
    app.route('/categories/:id')
        .get(app.api.category.getById)
        .put(app.api.category.save)
        .delete(app.api.category.remove)

    app.route('/articles')
        .get(app.api.article.get)
        .post(app.api.article.save)

    app.route('/articles/:id')    
        .get(app.api.article.getById)
        .put(app.api.article.save)
        .delete(app.api.article.remove)
    
     app.route('/categories/:id/articles')  
        .get(app.api.article.getByCategory) 
}       