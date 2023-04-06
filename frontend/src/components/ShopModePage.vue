<script lang="ts" setup>
import { ShallowRef, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useItemsStore } from '../stores/items';
import { useCategoriesStore } from '../stores/categories';
import { ItemPlus, ItemStatus } from '../../../app/app_types';

import ShopListItem from '../components/ShopListItem.vue';

const props = defineProps<{
	store_id: number
}>();

const router = useRouter();

const itemsStore = useItemsStore();
itemsStore.loadData();

const categoriesStore = useCategoriesStore();
categoriesStore.loadData();

const items = computed( () => {
	const s = props.store_id;
	return itemsStore.ordered_items.filter( (i) => {
		if( i.value.cur_status !== ItemStatus.buy && i.value.cur_status !== ItemStatus.inCart ) return false;
		return i.value.store_ids.includes(s);
	});
});

const catItems = computed( () => {
	const ret :{name: string, items: ShallowRef<ItemPlus>[] }[] = [];
	categoriesStore.sorted_categories.forEach( c => {
		ret.push({
			name: c.value.name,
			items: items.value.filter( i => i.value.category_id === c.value.category_id )
		})
	});
	ret.push({
		name: "[No Category]",
		items: items.value.filter( i => i.value.category_id === -1 )
	});
	return ret;
});

const in_cart_ids = computed( () => {
	return items.value.filter( i => i.value.cur_status === ItemStatus.inCart ).map( i => i.value.item_id );
});

async function finishClicked() {
	if( in_cart_ids.value.length === 0 ) {
		alert("No items have been checked off.");
		return;
	}
	if( confirm(`${in_cart_ids.value.length} items will be set to "stocked".`) ) {
		await itemsStore.batchSetItemStatus(in_cart_ids.value, ItemStatus.stocked);
		router.push('/');
	}
}

</script>

<template>
	<div v-for="cItems in catItems">
		<h2 v-if="cItems.items.length !== 0" class="pl-2 mt-6 mb-1 text-2xl font-medium text-center">{{ cItems.name }}</h2>
		<ShopListItem 
			v-for="item in cItems.items"
			:item="item"
		></ShopListItem>
	</div>
	<div v-if="items.length === 0" class="h-96 flex justify-center items-center italic text-gray-500">
		No items to buy at this store.
	</div>

	<Teleport to="#controls">
		<div class=" py-4 px-4 h-full flex justify-end items-stretch">
			<button 
				@click="finishClicked"
				class="px-2 border border-white flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pr-1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
				</svg>
				Check Out
			</button>
		</div>
	</Teleport>
</template>