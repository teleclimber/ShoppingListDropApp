import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AllStoresPage from '../components/AllStoresPage.vue';
import AddEditStore from '../components/AddEditStore.vue';
import CategoriesPage from '../components/CategoriesPage.vue';
import CategoryAddEdit from '../components/CategoryAddEdit.vue';
import ActiveItemsPage from '../components/ActiveItemsPage.vue';
import AddEditItem from '../components/AddEditItem.vue';
import ShopModePage from '../components/ShopModePage.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: ActiveItemsPage
	}, {
		path: '/stores',
		name: 'stores',
		component: AllStoresPage
	}, {
		path: '/add-store',
		name: 'add-store',
		component: AddEditStore
	}, {
		path: '/edit-store/:store_id',
		name: 'edit-store',
		component: AddEditStore,
		props: route => {
			let store_id :number|undefined;
			const qs = Number(route.params['store_id']);
			if( !isNaN(qs)  ) store_id = qs;
			return {
				store_id
			}
		}
	}, {
		path: '/categories',
		name: 'categories',
		component: CategoriesPage
	}, {
		path: '/add-category',
		name: 'add-category',
		component: CategoryAddEdit
	}, {
		path: '/edit-category/:category_id',
		name: 'edit-category',
		component: CategoryAddEdit,
		props: route => {
			let category_id :number|undefined;
			const qs = Number(route.params['category_id']);
			if( !isNaN(qs)  ) category_id = qs;
			return {
				category_id
			}
		}
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
			if( Array.isArray(p) ) throw new Error("item_id can not be an array");
			return {
				mode: "edit",
				item_id: parseInt(route.params.item_id as string)
			}
		}
	}, {
		path: '/shop/:store_id',
		name: 'shop',
		component: ShopModePage,
		props: route => {
			const p = route.params.store_id;
			if( Array.isArray(p) ) throw new Error("store_id can not be an array");
			return {
				store_id: parseInt(route.params.store_id as string)
			}
		}
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router
