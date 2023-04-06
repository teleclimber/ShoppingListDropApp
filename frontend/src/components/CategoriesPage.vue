<script setup lang="ts">
import { useCategoriesStore } from '../stores/categories';

const categoriesStore = useCategoriesStore();
categoriesStore.loadData();

</script>

<template>
	<div v-for="category in categoriesStore.sorted_categories" :key="category.value.category_id" 
		class="p-2 border-b relative bg-white flex justify-between">
		<span class="font-bold">{{category.value.name}}</span>
		<router-link :to="{name:'edit-category', params:{category_id:category.value.category_id}}"
			class="px-3 uppercase text-sm border border-blue-600 text-blue-600">
			edit</router-link>
	</div>
	<div class="pt-48 italic text-center text-gray-500">
		<span v-if="!categoriesStore.is_loaded">Loading...</span>
		<span v-else-if="categoriesStore.categories.size === 0">No categories.</span>
	</div>

	<router-link to="add-category" class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full fixed bottom-6 right-6">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
	</router-link>
</template>