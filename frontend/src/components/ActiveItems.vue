<script setup lang="ts">
	import { ShallowRef, Ref, ref, computed } from 'vue';
	import { useItemsStore } from '../stores/items';
	import { useCategoriesStore } from '../stores/categories';
	import { ItemPlus, ItemStatus } from '../../../app/app_types';

	import ActiveItem from './ActiveItem.vue';
	import StoreTag from './StoreTag.vue';
import { useStoresStore } from '../stores/stores';

	const expanded_item :Ref<number|undefined> = ref();

	const itemsStore = useItemsStore();
	itemsStore.loadData();

	const categoriesStore = useCategoriesStore();
	categoriesStore.loadData();

	const storesStore = useStoresStore();
	storesStore.loadData();

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
		const ret :{name: string, stores: Set<number>, items: ShallowRef<ItemPlus>[] }[] = [];
		categoriesStore.sorted_categories.forEach( c => {
			ret.push({
				name: c.value.name,
				stores: categories_stores.value.get(c.value.category_id) || new Set,
				items: filtered_items.value.filter( i => i.value.category_id === c.value.category_id )
			});
		});
		ret.push({
			name: "",
			stores: new Set,
			items: filtered_items.value.filter( i => i.value.category_id === -1 )
		});
		return ret;
	});

	// have to filter items by status, store, check_stock?

	// Also group items by category
	
	function toggleExpandItem(item_id:number) {
		if( item_id === expanded_item.value ) expanded_item.value = undefined;
		else expanded_item.value = item_id;
	}

</script>

<template>
	<div v-for="cItems in catItems">
		<h2 v-if="cItems.items.length !== 0" class="mt-6 text-2xl text-center"
			:class="[cItems.name ? ['font-medium'] : ['italic', 'text-gray-400']]">
			{{ cItems.name || '(No category)' }}
		</h2>
		<div class="my-1 flex flex-nowrap justify-center">
			<StoreTag v-for="store_id in cItems.stores" :store_id="store_id" :positive="true" class="mx-1"></StoreTag>
		</div>
		<div class="">
			<ActiveItem 
				v-for="item in cItems.items"
				:item="item"
				:cat_stores="cItems.stores"
				:expanded="expanded_item === item.value.item_id"
				@toggle-expand="toggleExpandItem(item.value.item_id)"
			></ActiveItem>
		</div>
	</div>
	<div v-if="filtered_items.length === 0" class="flex h-48 justify-center items-end italic text-gray-500">
		No active items.
	</div>
	<Teleport to="#controls">
		<div class=" py-4 h-full flex justify-end items-stretch">
			<router-link
				to="/?select-store"
				class="px-3 border border-white flex items-center">
				<img class=" h-5 w-5 invert" src="/static/icons8-fast-cart-24.png"/>
				Go Shop!
			</router-link>
		</div>
	</Teleport>
</template>