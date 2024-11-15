import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Chart from 'primevue/chart';
import 'element-plus/dist/index.css'
import 'primeicons/primeicons.css';  
import './style.css';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
});
app.component('Chart', Chart);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
