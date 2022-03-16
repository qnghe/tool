import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import { createRouter, createWebHistory } from 'vue-router';
import 'element-plus/dist/index.css';
import './assets/style/index.css';
import App from './App.vue';
import routes from './routes';
import api from './utils/ajax';

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);

app.config.globalProperties.$api = api;

app.use(ElementPlus);
app.use(router);
app.mount('#app');
