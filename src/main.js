import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App)
  .use(router)
  .mount('#app');
