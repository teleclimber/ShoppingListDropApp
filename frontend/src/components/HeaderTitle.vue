<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useMainListFilterStore } from '../stores/main_list_filter';
import { useStoresStore } from '../stores/stores';
import { useCollapsedCategoriesStore} from '../stores/collapsed_cats';

const route = useRoute();

const mainListFilter = useMainListFilterStore();
const show_filters = ref(false);

const collapsedCatsStore = useCollapsedCategoriesStore();

function filterClicked(f:string) {
	mainListFilter.set(f);
	show_filters.value = false;
	if( f === 'buy' )  collapsedCatsStore.expandAll();
}

const filter = computed( () => mainListFilter.get() );

const storesStore = useStoresStore();
storesStore.loadData();

const shop_store = computed( () => {
	if( route.name !== 'shop' ) return '';
	const store = storesStore.getStore(Number(route.params.store_id));
	if( !store ) return '?';
	return store.value.name;
})

</script>

<template>
	<div v-if="show_filters" class="bg-pink-500 top-20 absolute flex flex-col divide-y">
		<a href="#" class="px-6 py-3" @click.stop.prevent="filterClicked('all')">All Items</a>
		<a href="#" class="px-6 py-3" @click.stop.prevent="filterClicked('check-stock')">Check Stock Items</a>
		<a href="#" class="px-6 py-3" @click.stop.prevent="filterClicked('buy')">
			<span class="inline-flex px-2 text-sm font-bold bg-yellow-300 text-black items-center">
				<img class="h-4 w-4" src="/static/icons8-fast-cart-24.png"/>
				BUY
			</span>
			Items
		</a>
	</div>
	<a v-if="route.name === 'home'" href="#" @click.stop.prevent="show_filters = !show_filters" class="flex items-center">
		<span v-if="filter === 'all'">All Items</span>
		<span v-else-if="filter === 'check-stock'">Check Stock Items</span>
		<span v-else-if="filter === 'buy'">
			<span class="inline-flex px-3 py-1 text-sm font-bold bg-yellow-300 text-black items-center">
				<img class="h-4 w-4" src="/static/icons8-fast-cart-24.png"/>
				BUY
			</span>
			Items
		</span>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
		</svg>
	</a>
	<div v-else class="flex items-center">
		<a @click.stop.prevent="$router.back()" class="mr-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
			</svg>
		</a>
		<span v-if="route.name === 'shop'" class="flex items-center">
			<img class=" h-6 w-6 invert mr-1" src="/static/icons8-fast-cart-24.png"/>
			{{ shop_store }}
		</span>
		<span v-else-if="route.name === 'add-item'">Add Item</span>
		<span v-else-if="route.name === 'edit-item'">Edit Item</span>
		<span v-else-if="route.name === 'stores'">Stores</span>
		<span v-else-if="route.name === 'add-store'">Add Store</span>
		<span v-else-if="route.name === 'edit-store'">Edit Store</span>
		<span v-else-if="route.name === 'add-category'">Add Category</span>
		<span v-else-if="route.name === 'edit-category'">Edit Category</span>
		<span v-else>{{  route.name }}</span>
	</div>
</template>