module.exports = app =>{

    /*Funções de validação*/

//Se exisitir gera um erro 
function existsOrError(value,msg){
    if(!value) throw msg
    //se o arrya estiver vazio ele entra em erro 
    if(Array.isArray(value)&& value.length ===0) throw msg
    //verifica se não é uma string vazia 
    if(typeof value === 'string' && !value.trim()) throw msg
}
//Se não existe gera um erro
function notExistsOrError(value,msg){
    try{
        existsOrError(value,msg)
    }catch(msg){
        return
    }
    throw msg
}

//testar dis valores para ver se são iguais ou não
function equalsOrError(valueA,valueB,msg){
    if(valueA !== valueB) throw msg
}
/*Retorna as 3 funções e o consign será responsavel por carregar elas 
  chamando como app.api.validation.função*/
  return {existsOrError,notExistsOrError,equalsOrError}

}

