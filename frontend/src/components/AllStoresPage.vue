<script setup lang="ts">
import { computed } from 'vue';
import { useCategoriesStore } from '../stores/categories';
import { useStoresStore } from '../stores/stores';

const storesStore = useStoresStore();
storesStore.loadData();

const categoriesStore = useCategoriesStore();
categoriesStore.loadData();

const store_cat_names = computed( () => {
	const ret:Map<number, string[]> = new Map;
	storesStore.sorted_stores.forEach( store => {
		const cats = store.value.categories.map( c => categoriesStore.getCategory(c)?.value );
		cats.sort( (a,b) => {
			if( a === undefined || b === undefined  ) return -1;
			return a.sort_order - b.sort_order;
		});
		// @ts-ignore TS doesn't understand map chained to filter apparently.
		ret.set(store.value.store_id, cats.filter(c => c !== undefined).map( c => c.name ));
	});
	return ret;
});

</script>

<template>
	<div v-for="store in storesStore.sorted_stores" :key="store.value.store_id" 
		class="p-2 border-b relative bg-white">
		<div class="flex justify-between">
			<span class="font-bold block">{{store.value.name}}</span>
			<router-link :to="{name:'edit-store', params:{store_id:store.value.store_id}}"
			class="px-3 uppercase text-sm border border-blue-600 text-blue-600">
			edit</router-link>	
		</div>
		<div class="my-2 flex flex-wrap">
				<span v-for="cat_name in store_cat_names.get(store.value.store_id)"
					class="mr-2 mb-1 px-2 bg-blue-50 whitespace-nowrap">{{ cat_name }}</span>
			</div>
		
	</div>
	<div class="pt-48 italic text-center text-gray-500">
		<span v-if="!storesStore.is_loaded">Loading...</span>
		<span v-else-if="storesStore.stores.size === 0" >No stores.</span>
	</div>

	<router-link to="add-store" class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full fixed bottom-6 right-6">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
	</router-link>
</template>