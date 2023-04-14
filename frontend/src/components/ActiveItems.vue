<script setup lang="ts">
	import { ShallowRef, Ref, ref, computed } from 'vue';
	import { useItemsStore } from '../stores/items';
	import { useCategoriesStore } from '../stores/categories';
	import { ItemPlus, ItemStatus } from '../../../app/app_types';

	import ActiveItem from './ActiveItem.vue';

	const expanded_item :Ref<number|undefined> = ref();

	const itemsStore = useItemsStore();
	itemsStore.loadData();

	const categoriesStore = useCategoriesStore();
	categoriesStore.loadData();

	const filtered_items = computed( () => {
		return itemsStore.ordered_items.filter( i => i.value.check_stock || i.value.cur_status === ItemStatus.buy );
	});

	const catItems = computed( () => {
		const ret :{name: string, items: ShallowRef<ItemPlus>[] }[] = [];
		categoriesStore.sorted_categories.forEach( c => {
			ret.push({
				name: c.value.name,
				items: filtered_items.value.filter( i => i.value.category_id === c.value.category_id )
			});
		});
		ret.push({
			name: "",
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
		<h2 v-if="cItems.items.length !== 0" class="pl-2 mt-6 text-2xl text-center"
			:class="[cItems.name ? ['font-medium'] : ['italic', 'text-gray-400']]">
			{{ cItems.name || '(No category)' }}
		</h2>
		<div class="">
			<ActiveItem 
				v-for="item in cItems.items"
				:item="item"
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