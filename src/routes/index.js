
import Home from "../pages/home/Index.vue";
import AudioText from "../pages/audioToText/Index.vue";
const routes = [
    {path: '/', component: Home, name: 'home'},
    {path: '/audiotext', component: AudioText, name: 'audiotext'},
]

export default routes;