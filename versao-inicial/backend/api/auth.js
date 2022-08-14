    
/*Codigo do professor */
const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        //função de comparação de senhas
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        //se não for igual retorna erro
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')
        //captura a data atual e converte em milesegundos
        const now = Math.floor(Date.now() / 1000)

        //conteudo do token jwt
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
             //data de emissão do token 
            iat: now,
              /*Tempo de duração do token ai está dividido da seguinte maneira 
            60 segundos * 60 minutos * 24 horas * 15 dias então o ultimo valor 
            é quantidade de dias */
            exp: now + (60 * 60 * 24 * 15)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }
     //função de validação do token verifica se o toke é verdadeiro e ativo
    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }
}