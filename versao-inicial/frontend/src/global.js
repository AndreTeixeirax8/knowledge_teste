import Vue from 'vue'

export const userKey = '__knowledge_user'
//Endereço de comunicação para o back-end
export const baseApiUrl = 'http://localhost:3000'
/**Função que trata os erros do back-end e repassa o código do erro */
export function showError(e) {
    //se o (e) for verdade ai joga o erro para dentro da data
    if(e && e.response && e.response.data) {
        /**Aqui repassa a mensagen para o toasted */
        Vue.toasted.global.defaultError({ msg : e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg : e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }