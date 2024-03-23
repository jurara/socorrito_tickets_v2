
import { createApp } from 'vue';
import App from './App.vue';
//import router from './router';
//import store from './store';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import axios from 'axios'





const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },

})


const app = createApp(App);

//app.use(router);
//app.use(store);
app.use(vuetify);


app.component('EasyDataTable', Vue3EasyDataTable);
app.config.globalProperties.$axios = axios
app.config.productionTip = false;
app.config.globalProperties.$rutaBase = '/codigosdebarras/';
app.mount('#app');
