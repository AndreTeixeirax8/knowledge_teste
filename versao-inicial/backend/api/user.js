//importa o bcrypt para criptografar a senha do usuario
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    /*Para evitar ficar chamando o nome da api inteira , com isso podemos 
    chamar a função diretamente na pagina */
    const{existsOrError,notExistsOrError,equalsOrError}=app.api.validation
    //função responsavel por criptografar a senha
    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password,salt)
    }

    const save = async(req,res)=>{
        //pega os dados que vem do body e cria um objeto 
        const user = {...req.body}
        /* se a requisição já tem um ID então ele sabe que é uma edição e não um user novo
        estrutura se req.params.id é true então use.id recebe o id do paramas*/
        if(req.params.id) user.id = req.params.id

        //verifica se o usuario tem permissão de admin 
        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try{
            //Aqui fizemos o teste para verificar as validações
            existsOrError(user.name,'Nome não informado')
            existsOrError(user.email,'E-Mail não informado')
            existsOrError(user.password,'Senha não informado')
            existsOrError(user.confirmPassword,'Confirmação de senha não informado')
            //compara se as senha é igual a confirmação de senha 
            equalsOrError(user.password, user.confirmPassword,'Senhas não conferem')

            //validação para saber se o usuario já não está cadastrado no DB
            const userFromDB = await app.db('users')
                .where({email:user.email}).first()
                if(!user.id){
                    notExistsOrError(userFromDB,'Usuario já Cadastrado')
                }
               
        }catch(msg){
            //retorna um erro do lado do cliente por falta de alguma informação
            return res.status(400).send(msg)
        }
        //criptografar senha
        user.password = encryptPassword(user.password)
        //deleta a confirmação da senha
        delete user.confirmPassword

        if(user.id){
            //se o id existe ele atualiza a tabela 
            app.db('users').update(user)
            .where({id: user.id})
            .whereNull('deletedAt')
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }else{//caso não exista o id ele faz um insert
            app.db('users').insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }

    }
    //pega todos os users do DB
    const get = (req,res) =>{
        app.db('users')
        .select('id','name','email','admin')
        .whereNull('deletedAt')
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err))
    }

    //retorna o user por ID
    const getById = (req,res)=>{
        app.db('users')
            .select('id','name','email','admin')
            .where({id:req.params.id})
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async(req,res)=>{
        try{
            const articles = await app.db('articles')
                .where({userId: req.params.id})
                notExistsOrError(articles,'Usuário possui artigos')

                const rowsUpdated = await app.db('users')
                    .update({deletedAt: new Date()})
                    .where({id: req.params.id})
                    existsOrError(rowsUpdated,'Usuário não encotrado')

                    res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
    }

    //retorna os metodos save e get
    return {save,get,getById,remove}

}