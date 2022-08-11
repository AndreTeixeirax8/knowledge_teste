/*API de categoria */
module.exports = app =>{
    /*Para evitar ficar chamando o nome da api inteira , com isso podemos 
    chamar a função diretamente na pagina */
    const{existsOrError,notExistsOrError,equalsOrError}=app.api.validation
    //metodo para salvar uma categoria 
    const save = (req,res) => {
        const category = {...req.body}
        if(req.params.id) category.id = req.params.id

        try{
            existsOrError(category.name,'Nome não informado')
        }catch(msg){
            return res.status(400).send(msg)
        }

        if(category.id){//se já existe ele faz o update
            app.db('categories')
            .update(category)
            .where({id:category.id})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }else{//se não existe ele faz o insert
            app.db('categories')
            .insert(category)
            .then(_ =>res.status(204).send())
            .catch(err  => res.status(500).send(err))
        }
    }

    //Remover uma categoria, realiza algumas validações
    const remove = async(req,res) =>{
        try{
            existsOrError(req.params.id,'Código da Categoria não informado')
            //validação para saber se tem subcategoria
            const subcategory = await app.db('categories')
                  .where({ parentId: req.params.id })
                  
                  notExistsOrError(subcategory,'Categoria possui subcategorias')

                  const articles =await app.db('articles')
                        .where({categoryId: req.params.id})
                        notExistsOrError(articles,'Categoria possui artigos')

            const rowsDeleted = await app.db('categories')
                .where({id: req.params.id}).del() 
                existsOrError(rowsDeleted,'Categoria não foi encontrada')
                
                res.status(204).send()
        }catch(msg){
            res.send(400).send(msg)
        }
    }
    /*Função que cria o caminho do path de categorias e subcategorias
    esse campo não existe no banco ele vai ser montado na hora */
    const withPath = categories =>{
        //função para pegar a categoria pai de determinada categoria
        const getParent = (categories, parentId) => {
            //filtra pra ver se categoria tem o id exatamente do parent id que estamos procurando
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null              
        }

        /*Transforma um array de catetorias em outr array de categorias
         com um atributo a mais  com o path */
         const categoriesWithPath =  categories.map(category =>{
            //path sendo inciado com o nome da categoria 
            let path = category.name
            let parent = getParent(categories,category.parentId)
            //enquanto existe parent continua procurando e concatenando
            while(parent){
                path =`${parent.name} > ${path}`
                //procura o proximo parent
                parent =getParent(categories,parent.parentId)
            }
            return{...category,path}
         })

         //função para ordenação das categorias
         categoriesWithPath.sort((a,b)=>{
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0

         })
         
         return categoriesWithPath

    }

    //retornar todas as categorias do DB, como estou pedindo todas não precisa do select
    const get =(req,res)=>{
        app.db('categories')
        .then(categories => res.json(withPath(categories)))
        .catch(err => res.status(500).send(err))
    }

    //Retorna categoria por id
    const getById = (req,res) =>{
        app.db('categories')
        .where({id: req.params.id })
        .first()
        .then(category => res.json(category))
        .catch(err => res.status(500).send(err))
    }

    return{ save, remove,get,getById}

}