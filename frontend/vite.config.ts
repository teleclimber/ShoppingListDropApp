import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	build: {
		outDir:'../app/frontend/',
		emptyOutDir: true
	},
	server: {
		proxy: {
			'^\/api\/': {
				target: 'http://localhost:3003',
				changeOrigin: true,
				cookieDomainRewrite: ".localhost",
				secure: false,
				configure: (proxy, options) => {
					proxy.on("proxyReq", (proxyReq, req, res) => {
						console.log("proxy req", req.url);
						//proxyReq.setHeader('x-dev-mode', 'frontend');
					});
				}
			},
			'^\/avatars\/': {
				target: 'http://localhost:3003',
				changeOrigin: true,
				cookieDomainRewrite: ".localhost",
				secure: false,
			}
		}
	},
	plugins: [
		vue(),
		VitePWA({
			useCredentials: true,
			manifest: {
				"name": "Shopping List Dropapp",
				"short_name": "Shopping List",
				"start_url": ".",
				"display": "standalone",
				"background_color": "rgb(236, 72, 153)",
				"theme_color": "rgb(236, 72, 153)",
				"description": "Shopping list app with stock tracking.",
				"icons": [
					{
						"src": "static/cart-192.png",
						"sizes": "192x192",
						"type": "image/png",
						"purpose": "any"
					}, {
						"src": "static/cart-big-bg-512.png",
						"sizes": "512x512",
						"type": "image/png",
						"purpose": "maskable"
					}, {
						"src": "static/cart-big-bg-512.png",
						"sizes": "512x512",
						"type": "image/png",
						"purpose": "any"
					}
				]
			},
			workbox:{
				navigateFallback: null,
				// runtimeCaching: [{
				// 	urlPattern: ({_, url}) => {
				// 		return url.pathname.startsWith("/static")
				// 	},
				// 	handler: "CacheFirst",
				// 	options: {
				// 		expiration: {
				// 			maxAgeSeconds: 60*60*24*60,	// 60 days
				// 			purgeOnQuotaError: true
				// 		},
				// 		cacheName: "item-images"
				// 	}
				// }]
			},
			devOptions: {
				enabled: false
			}
		})
	]
});