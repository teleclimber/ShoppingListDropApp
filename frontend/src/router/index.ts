import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ActiveItemsPage from '../components/ActiveItemsPage.vue';
import NewItemPage from '../components/NewItemPage.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: ActiveItemsPage
	}, 	{
		path: '/new',
		name: 'New',
		component: NewItemPage
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router
