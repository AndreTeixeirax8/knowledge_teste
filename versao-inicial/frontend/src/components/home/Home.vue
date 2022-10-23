<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard"
            sub="Base de Conhecimento" />
        <div class="stats">
            <Stat title="Categorias" :value="stat.categories"
                icon="fa fa-folder" color="#d54d50" />
            <Stat title="Artigos" :value="stat.articles"
                icon="fa fa-file" color="#3bc480" />
            <Stat title="Usuários" :value="stat.users"
                icon="fa fa-user" color="#3282cd" />
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import Stat from './Stat'
//Faz requisição com o back-end
import axios from 'axios'
//Url base para fazer as requisições
import { baseApiUrl } from '@/global'

export default {
    name: 'Home',
    //Registro dos componentes 
    components: { PageTitle, Stat },
    /*obeter o estado interno do componentes atraves do back-end
    Data recebe um objeto nessa função*/
    data: function() {
        return {
            stat: {}
        }
    },
    methods: {
        getStats() {
            axios.get(`${baseApiUrl}/stats`).then(res => this.stat = res.data)
        }
    },
    //Metodo que de fato faz a requisição para Back-end 
    mounted() {
        this.getStats()
    }
}
</script>

<style>
    .stats {
        display: flex;
        justify-content: space-between;
        /** Esse componete permite que ao diminuir a tela os componente fiquem um emcima do outro*/
        flex-wrap: wrap;
    }
</style>
