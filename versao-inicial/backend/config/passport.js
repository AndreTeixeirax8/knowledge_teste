const{ authSecret } = require('../.env')
const passport = require('passport')
const passportJwt =  require('passport-jwt')
const {Strategy,ExtractJwt} = passportJwt

module.exports = app =>{
    //paramentros da estrategia 
    const params ={
        secretOrKey:authSecret,
        //função que procura no cabeçalho da requisisão o tokem e extrai ele e coloca na chave jwtFromRquest
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params,(payload,done)=>{
        app.db('users')
            .where({id: payload.id})
            .first()
            .then(user=> done(null,user ? {...payload}:false))
            .catch(err => done(err,false))
    })

    passport.use(strategy)

    return{
        /*autenticação  usada nas rotas para filtrar as requisições e não permitir 
        requisição sem user logado*/
        authenticate: ()  => passport.authenticate('jwt',{session:false})
    }
}