
import Home from "../pages/home/Index.vue";
import AudioText from "../pages/audioToText/Index.vue";
import SVG from '../pages/svgPage/Index.vue';
const routes = [
    {path: '/', component: Home, name: 'home'},
    {path: '/audiotext', component: AudioText, name: 'audiotext'},
    {path: '/svg', component: SVG, name: 'SVG'},
]

export default routes;