<script setup lang="ts">
import { ShallowRef, Ref, ref, computed } from 'vue';
import { useItemsStore } from '../stores/items';
import { useCategoriesStore } from '../stores/categories';
import { ItemPlus, ItemStatus } from '../../../app/app_types';

import ActiveItem from './ActiveItem.vue';
import StoreTag from './StoreTag.vue';
import { useStoresStore } from '../stores/stores';
import { useCollapsedCategoriesStore } from '../stores/collapsed_cats';

const expanded_item :Ref<number|undefined> = ref();

const itemsStore = useItemsStore();
itemsStore.loadData();

const categoriesStore = useCategoriesStore();
categoriesStore.loadData();

const storesStore = useStoresStore();
storesStore.loadData();

const collapsedCatsStore = useCollapsedCategoriesStore();

const categories_stores = computed( () => {
	const ret :Map<number,Set<number>> = new Map;
	if( !storesStore.is_loaded ) return ret;
	storesStore.stores.forEach( s => {
		s.value.categories.forEach( c => {
			if( !ret.has(c) ) ret.set(c, new Set);
			ret.get(c)!.add(s.value.store_id);
		});
	});
	return ret;
});

const filtered_items = computed( () => {
	return itemsStore.ordered_items.filter( i => i.value.check_stock || i.value.cur_status === ItemStatus.buy );
});

const catItems = computed( () => {
	const ret :{cat_id: number, name: string, stores: Set<number>, items: ShallowRef<ItemPlus>[] }[] = [];
	categoriesStore.sorted_categories.forEach( c => {
		ret.push({
			cat_id: c.value.category_id,
			name: c.value.name,
			stores: categories_stores.value.get(c.value.category_id) || new Set,
			items: filtered_items.value.filter( i => i.value.category_id === c.value.category_id )
		});
	});
	ret.push({
		cat_id: -1,
		name: "",
		stores: new Set,
		items: filtered_items.value.filter( i => i.value.category_id === -1 )
	});
	return ret;
});

function collapseAllCats() {
	const all_cats = Array.from(categoriesStore.categories.keys());
	all_cats.push(-1);
	collapsedCatsStore.collapse(all_cats);
}
function toggleExpandItem(item_id:number) {
	if( item_id === expanded_item.value ) expanded_item.value = undefined;
	else expanded_item.value = item_id;
}
const all_collapsed = computed( () => {
	return !categoriesStore.sorted_categories.some( c => !collapsedCatsStore.cc.has(c.value.category_id));
});
</script>

<template>
	<div v-for="cItems in catItems">
		<a 	class="block mt-6 text-2xl text-center"
			:class="[cItems.name ? ['font-medium'] : ['italic', 'text-gray-400']]"
			@click.stop.prevent="collapsedCatsStore.toggle(cItems.cat_id)">
			{{ cItems.name || '(No category)' }}
			<svg v-if="collapsedCatsStore.cc.has(cItems.cat_id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline w-6 h-6">
				<path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
			</svg>
			<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline w-6 h-6">
				<path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clip-rule="evenodd" />
			</svg>
		</a>
		<div v-if="!collapsedCatsStore.cc.has(cItems.cat_id)" class="my-1 flex flex-nowrap justify-center">
			<StoreTag v-for="store_id in cItems.stores" :store_id="store_id" :positive="true" class="mx-1"></StoreTag>
		</div>
		<template v-if="!collapsedCatsStore.cc.has(cItems.cat_id)" class="">
			<ActiveItem 
				v-for="item in cItems.items"
				:item="item"
				:cat_stores="cItems.stores"
				:expanded="expanded_item === item.value.item_id"
				@toggle-expand="toggleExpandItem(item.value.item_id)"
			></ActiveItem>
			<div v-if="cItems.items.length === 0" class="text-center text-gray-500 italic">no items</div>
		</template>
	</div>
	<div v-if="filtered_items.length === 0" class="flex h-48 justify-center items-end italic text-gray-500">
		No active items.
	</div>
	<Teleport to="#controls">
		<div class=" py-4 h-full flex justify-between items-stretch">
			<button
				@click="collapseAllCats"
				class="px-3 border border-white flex items-center"
				:class="[all_collapsed ? 'border-pink-300 text-pink-300' : 'border-white text-white' ]"
				>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
					<path fill-rule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5zm.53 7.59l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 12.31z" clip-rule="evenodd" />
				</svg>
				Collapse</button>
			<router-link
				to="/?select-store"
				class="px-3 border border-white flex items-center">
				<img class=" h-5 w-5 invert" src="/static/icons8-fast-cart-24.png"/>
				Go Shop!
			</router-link>
		</div>
	</Teleport>
</template>