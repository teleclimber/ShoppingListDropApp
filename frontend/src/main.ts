import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css';
import router from './router';
import App from './App.vue'; // Seeing a red squiggle in vscode? Use volar and disable builtin typescript extension. https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode
import { registerSW } from 'virtual:pwa-register';

const pinia = createPinia();

const updateSW = registerSW({
	onNeedRefresh() {
		if( confirm("A new version of the Shopping app is ready. Press OK to reload.") ) updateSW();
	},
	//onOfflineReady() {},
});

createApp(App).use(router).use(pinia).mount('#app')
