const queries = require('./queries')

module.exports = app =>{

     /*Para evitar ficar chamando o nome da api inteira , com isso podemos 
    chamar a função diretamente na pagina */
    const{existsOrError,notExistsOrError}=app.api.validation
    //metodo save serve tanto para insert quanto update
    const save =(req,res) =>{
        const article = {...req.body}
        if(req.params.id)article.id = req.params.id
        
        try{
            existsOrError(article.name,'Nome não informado')
            existsOrError(article.description,'Descrição não informada')
            existsOrError(article.categoryId,'Categoria não informada')
            existsOrError(article.userId,'Autor não informado')
            existsOrError(article.content,'Conteudo não informado')
        }catch(msg){
            res.status(400).send(msg)
        }

        if(article.id){
            //faz a conexão com o banco e a tabela
            app.db('articles')
            //se houver id ele atualiza
                .update(article)
                .where({id: article.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{//se não ele faz um insert
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req,res) =>{
        try{
            const rowsDeleted = await app.db('articles')
                .where({id: req.params.id}).del()

                try{
                    existsOrError(rowsDeleted,'Artigo não foi encontrado')
                }catch(msg){
                    return res.status(400).send(msg)
                }
                res.status(204).send()
                }catch(msg){
                    res.status(500).send(msg)
                }
    }

    /*Paginação dos artigos*/
    //Limit  da paginação
    const limit = 10

    const get = async (req,res) => {
        //Recebe a pagina que vai ir caso não vernha ele seta a pagina 1 como padrão 
        const page = req.query.page || 1
        //armazena o resultado na constante 
        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        app.db('articles')
            .select('id','name','description')
            //calcula o limite de pagina vezes o total
            .limit(limit).offset(page*limit - limit)
            .then(articles => res.json({data:articles,count,limit}))
            .catch(err => res.status(500).send(err))

    }

    const getById = (req,res) =>{
        app.db('articles')
            .where({id: req.params.id})
            .first()
            .then(article =>{
                //converte o formato binario para string 
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req,res) => {
        //essa função vai possuir paginação tambem
        const categoryId = req.params.id 
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren,categoryId)
        //estrai os ids e cria um array de ids
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles',u:'users'})
            .select('a.id','a.name', 'a.description','a.imageUrl',{author:'u.name'})
            .limit(limit).offset(page*limit - limit)
            .whereRaw('?? = ??',['u.id','a.userId'])
            .whereIn('categoryId',ids)
            .orderBy('a.id','desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))


    }

    return{save,remove,get,getById,getByCategory}

}