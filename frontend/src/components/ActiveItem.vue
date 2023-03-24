<script setup lang="ts">
import { ShallowRef, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ItemPlus, ItemStatus } from '../../../app/app_types';
import { useItemsStore } from '../stores/items';

import StoreTag from './StoreTag.vue';

const router = useRouter();

const itemsStore = useItemsStore();

const props = defineProps<{
	item: ShallowRef<ItemPlus>,
	expanded: boolean
}>();
const emit = defineEmits<{
  (e: 'toggle-expand'): void
}>();

const buy = computed( () => props.item.value.cur_status === "buy");

function editClicked(item_id:number) {
	router.push("/edit/"+item_id);
}
function setToBuy(item_id:number) {
	itemsStore.setItemStatus(item_id, ItemStatus.buy);
	emit('toggle-expand');
}
function setToStocked(item_id:number) {
	itemsStore.setItemStatus(item_id, ItemStatus.stocked);
	emit('toggle-expand');
}
</script>
<template>
	<div class="p-2 border-b relative bg-white" @click="$emit('toggle-expand')">
		<div class="grid grid-cols-2">
			<h2 class="font-bold overflow-hidden overflow-ellipsis" :class="{'whitespace-nowrap': !expanded}">{{ item.value.name }}</h2>
			<span v-if="item.value.cur_status === ItemStatus.buy" 
				class="flex justify-center px-3 mb-1 text-sm font-bold bg-yellow-300 self-start justify-self-end items-center">
				<img class=" h-4 w-4" src="/static/icons8-fast-cart-24.png"/>
				BUY
			</span>
			<span v-else-if="item.value.cur_status === ItemStatus.inCart"
				class="flex justify-center px-2 mb-1 text-xs font-bold rounded-full text-orange-50 bg-orange-400 self-start justify-self-end items-center">
				IN CART
			</span>
			<span v-else>
				&nbsp;
			</span>
			<p class="overflow-hidden overflow-ellipsis" :class="{'whitespace-nowrap': !expanded}">{{ item.value.description }}</p>
			<div class="flex flex-nowrap" :class="{'justify-end': !expanded, 'col-span-2': expanded}">
				<StoreTag v-for="store_id in item.value.store_ids" :store_id="store_id" class="ml-1"></StoreTag>
				<span v-if="item.value.store_ids.length === 0">&nbsp;</span>
			</div>
		</div>
		
		<div v-if="expanded" class="flex justify-end pt-2">
			<button 
				v-if="item.value.cur_status === 'stocked'"
				@click.stop.prevent="setToBuy(item.value.item_id)"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600  ">
				Buy
			</button>
			<button 
				v-if="item.value.cur_status === ItemStatus.buy"
				@click.stop.prevent="setToStocked(item.value.item_id)"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600">
				Stocked
			</button>
			<button
				@click.stop.prevent="editClicked(item.value.item_id)"
				class="ml-2 px-3 uppercase text-sm border border-blue-600 text-blue-600">Edit</button>
		</div>
	</div>
</template>
<style scoped>
.gridzz {
	grid-template-columns: auto auto;
}
</style>