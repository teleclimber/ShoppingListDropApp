<script setup lang="ts">
	import {ref, shallowRef, Ref, watch } from "vue";
	import { useRouter } from 'vue-router';
	import {Item} from '../../../app/types';
	import { getItems } from "../models/items";

	const router = useRouter();

	// context for quick add, depending on where it was invoked from?
	// -> invoked from category listing (like a + at bottom of category) -> implies a category, and search is limited to that category?
	// - same for store?
	// -> if in shop list presumable default to shop list store, and add direct to to shop list when done.


	// Type in box...
	// - looks for existing items that can be set to "buy" 
	// - looks for items that were bought in past (but are note tracked), tap creates new item using old item (or sets to buy? and starts tracking?)
	//   .. that will be a bit weird for things like clothes. Bought sem-regularly, but it's not the result of stock tracking really?)
	// - creates entirely new item with search term as name

	// What is there to set for adding an item?
	// Must:
	// - name
	// - category
	// Optional:
	// - Store
	// - track stock?
	// - description
	// - image
	// - 

	const show_popup = ref(false);

	const items = getItems();

	const search = ref("");
	watch( search, (s) => {
		show_popup.value = s !== "";
		// TODO we probably want this throttled
		// do we search locally or remotely? It seems all "active" items should easily fit locally?
		// I am not even sure what "active" means.

	});

	//const suggestions :Item[] = shallowRef([]);
	function populateSuggestions(s :string) {
		// get all items, look for term in name, description
		// also need to consider categories and stores when we get that context
		// And finally, don't try to add item that's already in "buy" for that store and category.
		// ..but be lenient with categories and stores overall.
	}

	// quickAdd is the button that adds the item with least amount of interaction possible.
	// I think this should the first item in the popup list of suggestions
	function quickAddClicked() {

	}
	function addClicked() {
		
		router.push("/add?name="+search.value);
		// This is the full add/edit dialog, and should be a different component.
	}




</script>


<template>
	<div>
		<div class="flex m-2">
			<input id="title" type="text" v-model="search" class="w-full px-2 shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
			<button @click.stop.prevent="addClicked" class="ml-2 px-4 py-2 bg-blue-600 text-white uppercase rounded">Add</button>
		</div>
		<div v-if="show_popup" class="border-2 border-gray-200 rounded">
			<div class="p-2">Quick add: {{ search }}</div>
		</div>
	</div>
</template>


