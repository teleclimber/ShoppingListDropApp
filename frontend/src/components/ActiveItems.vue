<script setup lang="ts">
	import { useItemsStore } from '../stores/items';
	import { useStoresStore } from '../stores/stores';
	import { ItemPlus, ItemStatus } from '../../../app/types';
	import { Ref, ref } from 'vue';

	const expanded_item :Ref<number|undefined> = ref();

	const itemsStore = useItemsStore();

	const storesStore = useStoresStore();

	interface Store {
		store_id: number,
		name: string
	}
	// interface ItemPlusView extends ItemPlus {
	// 	[key: string]: string|number|boolean|Date|null|number[]|Store[];
	// 	stores: Store[]
	// }

	// have to filter items by status, store, check_stock?

	// Also group items by category
	
	function toggleExpandItem(item_id:number) {
		if( item_id === expanded_item.value ) expanded_item.value = undefined;
		else expanded_item.value = item_id;
	}
	function editClicked(item_id:number) {
		// navigate..
	}
	function setToBuy(item_id:number) {
		itemsStore.setItemStatus(item_id, ItemStatus.buy);
	}
	function setToStocked(item_id:number) {
		itemsStore.setItemStatus(item_id, ItemStatus.stocked);
	}
</script>

<template>
	<div v-for="[_, item] in itemsStore.items" class="p-2 border-b relative">
		<div class="flex justify-between">
			<h2 class="font-bold">{{ item.value.name }}</h2>
			<span class="flex">
				<span v-if="item.value.cur_status === 'buy'" class="flex align-bottom rounded-full px-2 pt-1 bg-red-800 text-white text-xs font-bold">
					<img class="invert h-3 w-3" src="/icons8-fast-cart-24.png"/>
					BUY
				</span>
				<button class="rounded-full hover:bg-blue-200" @click.stop.prevent="toggleExpandItem(item.value.item_id)">
				<svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path v-if="expanded_item === item.value.item_id" stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
					<path v-else stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</button>
			</span>
		</div>
		<p>{{ item.value.description }}</p>
		<div>
			<span v-for="store_id in item.value.stores" class="rounded-full bg-gray-200 px-2">
				{{  }}
			</span>
		</div>
		<div v-if="expanded_item === item.value.item_id" class="flex justify-end">
			<button 
				v-if="item.value.cur_status === 'stocked'"
				@click.stop.prevent="setToBuy(item.value.item_id)"
				class="px-2 py-1 bg-blue-600 uppercase text-white rounded-sm text-sm flex">
				<img class="invert scale-50" src="/icons8-fast-cart-24.png"/>
				Buy
			</button>
			<button 
				v-if="item.value.cur_status === 'buy'"
				@click.stop.prevent="setToStocked(item.value.item_id)"
				class="px-2 py-1 bg-blue-600 uppercase  text-white rounded-sm text-sm flex">
				<img class="invert scale-50" src="/icons8-grocery-shelf-24.png"/>
				Stocked
			</button>
			<button
				@click.stop.prevent="editClicked(item.value.item_id)"
				class="ml-2 px-2 py-1 bg-blue-600 uppercase text-white rounded-sm text-sm">Edit</button>
		</div>
	</div>

</template>