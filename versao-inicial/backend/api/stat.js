module.exports = app =>{
    const Stat = app.mongoose.model('Stat',{
        users:Number,
        categories:Number,
        articles:Number,
        createdAt:Date
    })

    const get = (req,res)=>{
        //pega a ultima estatitisca cadastrada no mongo db
        Stat.findOne({},{},{sort:{'createdAt': -1 }})
            .then(stat => {
                const defaultStat ={
                    users:0,
                    categories:0,
                    articles:0,
                    createdAt:Date  
                }
                res.json( stat || defaultStat)
            })
    }

    //pare ser acessivel a api tem que ter ume retorno
    return{Stat,get}

}