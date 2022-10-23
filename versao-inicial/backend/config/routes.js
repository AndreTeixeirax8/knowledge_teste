const admin = require('./admin')
/*Definição das rotas da aplicação
Tomar cuidado na rotas mantes sempre a rota pricipla na frente
das outras que vão receber um parametro como id */

module.exports = app =>{

    //rotas de autenticação
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
    //firltro usado para forçar a autenticação
    .all(app.config.passport.authenticate())
    /*O consign faz a busca automatica dos arquivos necessarios 
    Não sendo necessario fazer o require do user para usar a função save*/
    .post(app.api.user.save)
    //rota do get para obter a lista de users do banco
    .get(app.api.user.get)

    app.route('/users/:id')
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        //retorna o user ID 
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))
    
    //rota de categoria 
    app.route('/categories')
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate())
        .get(app.api.category.get)
        .post(app.api.category.save)

     app.route('/categories/tree')
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)
        
    app.route('/categories/:id')
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))

    app.route('/articles')
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate())
        .get(app.api.article.get)
        .post(app.api.article.save)

    app.route('/articles/:id')   
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate()) 
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        //o admin leva para o middleware e verifica se ele é admin ou não 
        .delete(admin(app.api.article.remove))
    
     app.route('/categories/:id/articles')  
        //firltro usado para forçar a autenticação
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory) 


    app.route('/stats')
        .get(app.api.stat.get)
}       