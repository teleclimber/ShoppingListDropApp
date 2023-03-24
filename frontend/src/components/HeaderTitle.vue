<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useStoresStore } from '../stores/stores';

const route = useRoute();

const storesStore = useStoresStore();

const shop_store = computed( () => {
	if( route.name !== 'shop' ) return '';
	const store = storesStore.getStore(Number(route.params.store_id));
	if( !store ) return '?';
	return store.name;
})

</script>

<template>
	<span v-if="route.name === 'home'">Items List</span>
	<span v-else-if="route.name === 'shop'" class="flex items-center">
		<a @click.stop.prevent="$router.back()" class="mr-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
			</svg>
		</a>

		<img class=" h-6 w-6 invert mr-1" src="/static/icons8-fast-cart-24.png"/>
		{{ shop_store }}
	</span>
	<span v-else-if="route.name === 'add-item'">Add Item</span>
	<span v-else-if="route.name === 'edit-item'">Edit Item</span>
	<span v-else>{{  route.name }}</span>
</template>