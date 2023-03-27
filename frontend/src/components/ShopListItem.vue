<script setup lang="ts">
import { ShallowRef, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ItemPlus, ItemStatus } from '../../../app/app_types';
import { useItemsStore } from '../stores/items';

const router = useRouter();

const itemsStore = useItemsStore();

const props = defineProps<{
	item: ShallowRef<ItemPlus>
}>();

const expanded = ref(false);

const in_cart = computed( () => props.item.value.cur_status === ItemStatus.inCart);

function editClicked() {
	router.push("/edit/"+props.item.value.item_id);
}
function toggleInCart() {
	let new_status = ItemStatus.inCart;
	if( in_cart.value ) new_status = ItemStatus.buy;
	itemsStore.setItemStatus(props.item.value.item_id, new_status);
}

</script>
<template>
	<div class="p-2 border-b relative grid item-grid" :class="[in_cart ?'bg-green-50' : 'bg-white']">
		<div class="min-w-0" @click="expanded = !expanded">
			<h2 class="overflow-hidden overflow-ellipsis text-xl" 
				:class="[in_cart ? ['text-gray-800/60', 'font-normal'] : ['text-black', 'font-bold']]">
				{{ item.value.name }}</h2>
			
			<div v-if="expanded" class="pt-2">
				<p class="overflow-hidden overflow-ellipsis " :class="{'whitespace-nowrap': !expanded}">
				{{ item.value.description || "&nbsp;" }}
				</p>
				<div>
					<button
						@click.stop.prevent="editClicked()"
						class="px-3 uppercase text-sm border border-blue-600 text-blue-600">Edit</button>
				</div>
			</div>
		</div>
		
		<div class="flex justify-center items-center" >
			<button @click.stop.prevent="toggleInCart">
				<svg v-if="in_cart" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-green-700">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
				</svg>
				<svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-gray-500">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
				</svg>

			</button>
		</div>
	</div>
</template>
<style scoped>
.item-grid {
	grid-template-columns: auto 40px;
}
</style>