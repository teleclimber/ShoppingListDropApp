<script setup lang="ts">
import { ref, Ref, watch, isReactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useItemsStore } from '../stores/items';
import { useCategoriesStore } from '../stores/categories';
import { useStoresStore } from '../stores/stores';
import { ItemStatus } from '../../../app/types';

const router = useRouter();

const props = defineProps<{
	mode: string,
	start_name: string|undefined,
}>();

function setInitialValues() {
	if( props.mode === "edit" ) {
		name.value = "val from data"
	}
	else {
		name.value = props.start_name || "";
		// category_id.value = ...
	}
}

onBeforeMount(setInitialValues);
watch(props, setInitialValues);



// open popup / or full page window with 
// - description
// - take an pic?
// - category
// - stores select
// - track stock ("consumable")
// And a button to finally add

const categoriesStore = useCategoriesStore();
const itemsStore = useItemsStore();

const storesStore = useStoresStore();

const name = ref("");
const description = ref("");
const category_id = ref(-1);
const store_ids :Ref<number[]> = ref([]);
const check_stock = ref(false);
const cur_status :Ref<ItemStatus> = ref(ItemStatus.buy);

function submitClicked() {
	// name can't be blank
	// ideally name should be unique? Or not?
	const n = name.value.trim();
	if( n === "" ) {
		alert("name can't be blank");
		return;
	}

	itemsStore.addItem({
		name: n,
		description: description.value,
		image: "",
		category_id: category_id.value,
		check_stock: check_stock.value,
		deleted: null,
		cur_status: cur_status.value,
		store_ids: store_ids.value
	});

	// then go to... main page?
	router.push("/");
	
}
function cancelClicked() {
	
}

function statusClass(s :ItemStatus) :string[] {
	if( s === cur_status.value ) {
		return ['text-white', 'bg-blue-600', 'border-blue-800'];
	}
	return ['text-blue-700', 'bg-blue-50', 'border-blue-400'];
}
</script>


<template>
	<form action="/" method="post">
		<div class="my-4">
			<label for="name" class="block text-sm font-medium text-gray-700">
				Item name:
			</label>
			<div class="mt-1">
				<input id="name" type="text" v-model="name" class="w-full shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
			</div>
		</div>

		<div class="my-4">
			<label for="description" class="block text-sm font-medium text-gray-700">
				Notes:
			</label>
			<div class="mt-1">
				<textarea v-model="description" id="description" name="description" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder="Was yummy! One portion left..." />
			</div>
		</div>

		<!-- have image thumbnail here and button to delete it / open camera -->

		<div class="my-4">
			<label for="category" class="block text-sm font-medium text-gray-700">
				Category:
			</label>
			<div class="mt-1">
				<select id="category" v-model="category_id">
					<option :value="-1">None</option>
					<option v-for="cat in categoriesStore.categories" :value="cat.category_id">{{ cat.name }}</option>
				</select>
			</div>
		</div>

		<div class="my-4">
			<label for="stores" class="block text-sm font-medium text-gray-700">
				Stores:
			</label>
			<div class="mt-1">
				<select id="stores" multiple v-model="store_ids">
					<option v-for="store in storesStore.stores" :value="store.store_id">{{ store.name }}</option>
				</select>
			</div>
		</div>

		<div class="my-4 flex">
			<input id="consumable" type="checkbox" v-model="check_stock" />
			<label for="consumable" class="pl-1 font-medium text-gray-700">
				Check stock on this item
			</label>
		</div>

		<div class="my-4 flex">
			<label for="status-stocked" class="py-2 px-4 uppercase font-bold border rounded-l-lg" 
					:class="statusClass(ItemStatus.stocked)">
				<input id="status-stocked" type="radio" v-model="cur_status" :value="ItemStatus.stocked"  />
				<span class="pl-2">Stocked</span>
			</label>
			<label for="status-buy" class="py-2 px-4 uppercase font-bold border"
				:class="statusClass(ItemStatus.buy)">
				<input id="status-buy" type="radio" v-model="cur_status" :value="ItemStatus.buy"  />
				<span class="pl-2">Buy</span>
			</label>
			<label for="status-in-cart" class="py-2 px-4 uppercase font-bold border rounded-r-lg"
				:class="statusClass(ItemStatus.inCart)">
				<input id="status-in-cart" type="radio" v-model="cur_status" :value="ItemStatus.inCart"  />
				<span class="pl-2">In Cart</span>
			</label>
		</div>

		<div class="flex justify-between">
			<button type="button" class="px-4 py-2 bg-blue-600 uppercase font-bold text-white rounded-lg"
				@click.stop.prevent="cancelClicked()">Cancel</button>
  			<button type="submit" class="px-4 py-2 bg-blue-600 uppercase font-bold text-white rounded-lg"
				@click.stop.prevent="submitClicked()">Submit</button>
		</div>
	</form>
</template>