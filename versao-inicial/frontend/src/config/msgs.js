/**Import do Vue toasted , aqui configuramos cores e icones e mensagens  */
import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    /**Usar icones do fontawesome */
    iconPack: 'fontawesome',
    /**Duração */
    duration: 3000
})
/**Mensagens padrões  */
Vue.toasted.register(
    'defaultSuccess',
    payload => !payload.msg ? 'Operação realidada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'defaultError',
    /**Função call back que traz uma mensagem de erro se não estiver setado 
     * ai mostra a mensagem padrão 
     * A palavra payload pode ser qualquer palvara , é só a variavel que vai receber a mensagem
     */
    payload => !payload.msg ? 'Oops.. Erro inesperado.' : payload.msg,
    { type : 'error', icon : 'times' }
)