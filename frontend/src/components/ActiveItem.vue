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
		<div class="grid grid-cols-4">
			<h2 class="font-bold col-span-3 overflow-hidden overflow-ellipsis" :class="{'whitespace-nowrap': !expanded}">{{ item.value.name }}</h2>
			<span v-if="buy" class="flex justify-center px-3 mb-1 text-sm font-bold bg-yellow-300 self-start justify-self-end">
				<img class=" h-4 w-4" src="/static/icons8-fast-cart-24.png"/>
				BUY
			</span>
			<span v-else>
				&nbsp;
			</span>
			<p class="col-span-3 overflow-hidden overflow-ellipsis" :class="{'whitespace-nowrap': !expanded}">{{ item.value.description }}</p>
			<div class="flex flex-nowrap" :class="{'justify-end': !expanded, 'col-span-4': expanded}">
				<StoreTag v-for="store_id in item.value.store_ids" :store_id="store_id" class="ml-1"></StoreTag>
				<span v-if="item.value.store_ids.length === 0">&nbsp;</span>
			</div>
		</div>
		
		<div v-if="expanded" class="flex justify-end pt-2">
			<button 
				v-if="item.value.cur_status === 'stocked'"
				@click.stop.prevent="setToBuy(item.value.item_id)"
				class="rounded px-2 py-1 bg-blue-600 uppercase text-white text-sm font-bold">
				Buy
			</button>
			<button 
				v-if="item.value.cur_status === 'buy'"
				@click.stop.prevent="setToStocked(item.value.item_id)"
				class="px-2 py-1 bg-blue-600 uppercase  text-white rounded text-sm font-bold">
				Stocked
			</button>
			<button
				@click.stop.prevent="editClicked(item.value.item_id)"
				class="ml-2 px-2 py-1 bg-blue-600 uppercase text-white rounded text-sm font-bold">Edit</button>
		</div>
	</div>
</template>
<style scoped>
.gridzz {
	grid-template-columns: auto auto;
}
</style>