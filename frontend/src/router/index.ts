import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ActiveItemsPage from '../components/ActiveItemsPage.vue';
import AddItemPage from '../components/AddItemPage.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: ActiveItemsPage
	}, {
		path: '/add',
		name: 'add-item',
		component: AddItemPage,
		props: route => ({name: route.query.name})
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router
