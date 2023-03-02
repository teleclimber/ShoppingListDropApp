import { createApp } from 'vue'
import './style.css'
import router from './router';
import App from './App.vue'; // Seeing a red squiggle in vscode? Use volar and disable builtin typescript extension. https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode


createApp(App).use(router).mount('#app')
