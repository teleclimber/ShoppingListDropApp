<script setup lang="ts">
	import {ref, shallowRef, ShallowRef, Ref, watch } from "vue";
	import { useRouter } from 'vue-router';
	import {ItemPlus, ItemStatus} from '../../../app/types';
	import { useItemsStore } from "../stores/items";

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

	const search_box_input :Ref<HTMLInputElement|undefined> = ref();

	function selectAndFocus() {
		if( search_box_input.value ) {
			search_box_input.value.select();
			search_box_input.value.focus();
		}
	}
	const show_popup = ref(false);

	const itemsStore = useItemsStore();

	const search = ref("");
	watch( search, (s) => {
		show_popup.value = s !== "";
		populateSuggestions(s);
		// TODO we probably want this throttled
		// do we search locally or remotely? It seems all "active" items should easily fit locally?
		// I am not even sure what "active" means.

	});

	const suggestions :ShallowRef<ShallowRef<ItemPlus>[]> = shallowRef([]);
	function populateSuggestions(s :string) {
		// get all items, look for term in name, description
		// also need to consider categories and stores when we get that context
		// And finally, don't try to add item that's already in "buy" for that store and category.
		// ..but be lenient with categories and stores overall.
		const sugg :ShallowRef<ItemPlus>[] = [];
		const re = new RegExp(s, "i")
		itemsStore.items.forEach( item => {
			if( re.test(item.value.name) ) sugg.push(item);
		});
		suggestions.value = sugg;
	}

	function setToBuy(item_id: number) {
		itemsStore.setItemStatus(item_id, ItemStatus.buy);
		selectAndFocus();
	}

	// quickAdd is the button that adds the item with least amount of interaction possible.
	// I think this should the first item in the popup list of suggestions
	function quickAddClicked() {
		itemsStore.addItem({
			name: search.value,
			description: "",
			category_id: -1,
			check_stock: false,
			cur_status: ItemStatus.buy,
			image: "",
			store_ids: [],
			deleted: null
		});
		search.value = '';
		selectAndFocus();

	}
	function addClicked() {
		
		router.push("/add?name="+search.value);
		// This is the full add/edit dialog, and should be a different component.
	}

</script>

<template>
	<div class="relative">
		<div class="flex m-2">
			<!-- this should be a form... -->
			<input id="title" type="text" v-model="search" ref="search_box_input" class="w-full px-2 shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
			<button @click.stop.prevent="quickAddClicked" class="ml-2 px-4 py-2 bg-blue-600 text-white uppercase rounded whitespace-nowrap">Quick Add</button>
		</div>
		<div v-if="show_popup" class="px-3 absolute z-30 w-full">
			<div class="border-2 border-gray-200 rounded bg-white   box-border shadow-lg">
				<div class="p-3 flex justify-between">
					<span>New item: {{ search }}</span>
					<button 
						class="text-blue-600 uppercase font-bold text-sm rounded"
						@click="addClicked()">new item</button>
				</div>
				<div v-for="s in suggestions" class="p-3 flex justify-between border border-t">
					<span class="font-bold">{{ s.value.name }}</span>
					<button 
						v-if="s.value.cur_status === ItemStatus.stocked"
						class="px-4 py-1 bg-blue-600 text-white text-sm font-bold uppercase rounded"
						@click="setToBuy(s.value.item_id)">Buy</button>
					<span v-else-if="s.value.cur_status === ItemStatus.buy"
						class="flex align-bottom rounded-full px-2 pt-1 bg-red-800 text-white text-xs font-bold">
						<img class="invert h-3 w-3" src="/icons8-fast-cart-24.png"/>
						BUY
					</span>
					<span v-else>Item is set to {{ s.value.cur_status }}</span>

				</div>
			</div>
		</div>
	</div>
</template>
