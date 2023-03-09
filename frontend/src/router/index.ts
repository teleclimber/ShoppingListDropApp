import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ActiveItemsPage from '../components/ActiveItemsPage.vue';
import AddEditItem from '../components/AddEditItem.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: ActiveItemsPage
	}, {
		path: '/add',
		name: 'add-item',
		component: AddEditItem,
		props: route => ({mode:"add", start_name: route.query.name})
	}, {
		path: '/edit/:item_id',
		name: 'edit-item',
		component: AddEditItem,
		props: route => {
			const p = route.params.item_id;
			if( Array.isArray(p) ) throw new Error("item_id can not be an array")
			return {
				mode: "edit",
				item_id: parseInt(route.params.item_id as string)
			}
		}
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router
