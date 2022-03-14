import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './assets/style/index.css';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes
});
const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount('#app');
