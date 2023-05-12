<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import { ItemPlus, ItemStatus } from '../../../app/app_types';
import { useItemsStore } from '../stores/items';

import StoreTag from './StoreTag.vue';

const router = useRouter();

const itemsStore = useItemsStore();

const props = defineProps<{
	item: ItemPlus,
	cat_stores?: Set<number> | undefined,
	expanded: boolean,
	search_mode: boolean
}>();
const emit = defineEmits<{
  (e: 'toggle-expand'): void,
  (e: 'buy-clicked'): void
}>();

const stores :ComputedRef<Set<number>> = computed( () => {
	if( props.item.generic ) {
		if( props.expanded ) return new Set(props.cat_stores);
		else return new Set;
	}
	else {
		return new Set( props.item.store_ids );
	}
});

function editClicked() {
	router.push("/edit/"+props.item.item_id);
}
function setToBuy(toggle_expand: boolean) {
	itemsStore.setItemStatus(props.item.item_id, ItemStatus.buy);
	emit('buy-clicked');
	if( toggle_expand) emit('toggle-expand');
}
function setToStocked() {
	itemsStore.setItemStatus(props.item.item_id, ItemStatus.stocked);
	emit('toggle-expand');
}
</script>
<template>
	<div class="p-2 border-b relative bg-white" @click="$emit('toggle-expand')">
		<div class="grid grid-cols-2">
			<h2 class="font-medium text-lg overflow-hidden overflow-ellipsis" :class="{'whitespace-nowrap': !expanded}">{{ item.name }}</h2>
			<span v-if="item.cur_status === ItemStatus.buy" 
				class="flex justify-center px-3 mb-1 text-sm font-bold bg-yellow-300 self-start justify-self-end items-center">
				<img class=" h-4 w-4" src="/static/icons8-fast-cart-24.png"/>
				BUY
			</span>
			<span v-else-if="item.cur_status === ItemStatus.inCart"
				class="flex justify-center px-2 mb-1 text-xs font-bold rounded-full text-orange-50 bg-orange-400 self-start justify-self-end items-center">
				IN CART
			</span>
			<button 
				v-else-if="search_mode && !expanded"
				@click.stop.prevent="setToBuy(false)"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600 self-start justify-self-end">
				Buy
			</button>
			<span v-else>
				&nbsp;
			</span>
			<p class="overflow-hidden overflow-ellipsis" :class="{'whitespace-nowrap': !expanded, 'col-span-2': expanded}">
				{{ item.description }}
			</p>
			<div class="flex flex-nowrap" :class="{'justify-end': !expanded, 'col-span-2': expanded}">
				<StoreTag v-for="store_id in stores" :store_id="store_id" class="mr-1"></StoreTag>
			</div>
		</div>
		
		<div v-if="expanded" class="flex justify-between pt-2">
			<button
				@click.stop.prevent="editClicked"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600">Edit</button>
			<button 
				v-if="item.cur_status === 'stocked'"
				@click.stop.prevent="setToBuy(true)"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600  ">
				Buy
			</button>
			<button 
				v-if="item.cur_status === ItemStatus.buy"
				@click.stop.prevent="setToStocked()"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600">
				Stocked
			</button>
		</div>
	</div>
</template>
