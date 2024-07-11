<script setup lang="ts">
import { ref, Ref, watch, onBeforeMount, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useItemsStore } from '../stores/items';
import { useCategoriesStore } from '../stores/categories';
import { useStoresStore } from '../stores/stores';
import { ItemStatus } from '../../../app/app_types';

const router = useRouter();

const props = defineProps<{
	mode: string,
	start_name?: string,
	item_id?: number
}>();

const itemsStore = useItemsStore();
itemsStore.loadData();

const categoriesStore = useCategoriesStore();
categoriesStore.loadData();

const storesStore = useStoresStore();
storesStore.loadData();

const name = ref("");
const description = ref("");
const category_id = ref(-1);
const generic = ref(true);
const stores :Ref<Set<number>> = ref(new Set);
const check_stock = ref(true);
const cur_status :Ref<ItemStatus> = ref(ItemStatus.buy);

function setInitialValues() {
	if( props.mode === "edit" ) {
		if( props.item_id === undefined ) throw new Error("undefined item_id");
		if( !itemsStore.is_loaded ) return;
		const item = itemsStore.mustGetItem(props.item_id).value;
		name.value = item.name;
		description.value = item.description;
		category_id.value = item.category_id;
		generic.value = item.generic;
		stores.value = new Set;
		item.store_ids.forEach( (s) => {
			stores.value.add(s);
		});
		check_stock.value = item.check_stock;
		cur_status.value = item.cur_status;
	}
	else {
		name.value = props.start_name || "";
		description.value = "";
		category_id.value = -1;
		generic.value = true;
		stores.value = new Set;
		check_stock.value = true;
		cur_status.value = ItemStatus.buy;
	}
}

onBeforeMount(setInitialValues);
watch([props, () => itemsStore.is_loaded], setInitialValues);

const name_input :Ref<HTMLInputElement|undefined>= ref();
onMounted( () => {
	if( name_input.value ) name_input.value.focus();
});

// store_cat: store_id=> boolean. true if item is automatically in store based on category
const cat_stores = computed( () => {
	const ret :Set<number> = new Set;
	const cat_id = category_id.value;
	storesStore.sorted_stores.forEach( s => {
		if( s.value.categories.includes(cat_id) ) ret.add( s.value.store_id, );
	});
	return ret;
});

// const store_net = computed( () => {
// 	const ret :Map<number,boolean> = new Map;
// 	storesStore.sorted_stores.forEach( s => {
// 		const store_id = s.value.store_id;
// 		if( stores.value.has(store_id) ) {
// 			const is_in = stores.value.get(store_id);
// 			if( is_in === undefined ) throw new Error('unexpected undefined');
// 			ret.set( store_id, is_in );
// 		}
// 		else {
// 			const is_in = stores_cat.value.get(store_id);
// 			if( is_in === undefined ) throw new Error('unexpected undefined');
// 			ret.set( store_id, is_in );
// 		}
// 	});
// 	return ret;
// });

async function submitClicked() {
	// name can't be blank
	// ideally name should be unique? Or not?
	const n = name.value.trim();
	if( n === "" ) {
		alert("name can't be blank");
		return;
	}

	const store_ids :number[] = [];
	if( !generic.value ) {
		stores.value.forEach( (store_id) => {
			store_ids.push(store_id);
		});
	}

	if( props.mode === "add" ) {
		await itemsStore.addItem({
			name: n,
			description: description.value,
			image: "",
			category_id: category_id.value,
			generic: generic.value,
			check_stock: check_stock.value,
			deleted: null,
			cur_status: cur_status.value,
			store_ids
		});
	}
	else if( props.mode === "edit" ) {
		if( props.item_id === undefined ) throw new Error("ietm_id should not be undefined if mode is edit");
		await itemsStore.editItem(props.item_id, {
			name: n,
			description: description.value,
			image: "",
			category_id: category_id.value,
			generic: generic.value,
			check_stock: check_stock.value,
			deleted: null,
			cur_status: cur_status.value,
			store_ids
		});
	}
	else throw new Error("what is this mode?? "+props.mode);

	router.back();
}
function cancelClicked() {
	router.back();
}

function statusClass(s :ItemStatus) :string[] {
	if( s === cur_status.value ) {
		return ['text-white', 'bg-blue-600', 'border-blue-800'];
	}
	return ['text-blue-700', 'bg-blue-50', 'border-blue-400'];
}
</script>

<template>
	<div class="p-2">
		<form @submit.prevent="submitClicked" @keyup.esc="cancelClicked">
			<div class="my-4">
				<label for="name" class="block text-sm font-medium text-gray-700">
					Item name:
				</label>
				<div class="mt-1">
					<input id="name" type="text" v-model="name" ref="name_input" class="w-full shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
				</div>
			</div>

			<div class="my-4">
				<label for="description" class="block text-sm font-medium text-gray-700">
					Notes:
				</label>
				<div class="mt-1">
					<textarea 
						v-model="description"
						id="description"
						name="description"
						rows="3"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
						placeholder="Quick Description of item..." />
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
						<option v-for="cat in categoriesStore.sorted_categories" :value="cat.value.category_id">{{ cat.value.name }}</option>
					</select>
				</div>
			</div>

			<div class="my-4">
				<h4 for="stores" class="block text-sm font-medium text-gray-700">
					Stores:
				</h4>
				<div class="mt-1 border border-t-0 bg-white">
					<label class="flex items-center border-t" :class="[generic ? 'bg-yellow-200' : '']">
						<span class="px-4">
							<input type="checkbox" v-model="generic" />
						</span>
						<span class="py-2 flex-grow italic font-medium">Generic item: stores determined by category</span>
					</label>
					<label class="flex items-center border-t" 
						:class="[(generic && cat_stores.has(store.value.store_id)) 
							|| (!generic && stores.has(store.value.store_id)) ? 'bg-yellow-100' : '']"
						v-for="store in storesStore.sorted_stores">
						<span class="px-4">
							<input v-if="generic" type="checkbox" v-model="cat_stores" :value="store.value.store_id" disabled />
							<input v-else type="checkbox" v-model="stores" :value="store.value.store_id" />
						</span>
						<span class="py-2 flex-grow">{{ store.value.name }}</span>
						
					</label>
				</div>
			</div>

			<div class="my-6 flex">
				<label for="consumable" class="py-2 px-4 uppercase font-bold border rounded-lg flex "
					:class="check_stock ? ['bg-pink-500', 'border-pink-600', 'text-white'] : ['bg-white', 'border-gray-300']" >
					<input id="consumable" type="checkbox" v-model="check_stock" />
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-3 mr-1 size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
					</svg>
					Check stock on this item
				</label>
			</div>

			<div class="my-4 flex w-full sm:w-96">
				<label for="status-stocked" class="py-2 px-4 uppercase font-bold border rounded-l-lg" 
						:class="statusClass(ItemStatus.stocked)">
					<input id="status-stocked" type="radio" v-model="cur_status" :value="ItemStatus.stocked"  />
					<span class="pl-2">Stocked</span>
				</label>
				<label for="status-buy" class="py-2 px-4 uppercase font-bold border flex-grow"
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

			<div class="mt-6 flex justify-between">
				<input type="button" class="px-4 py-2 uppercase font-bold text-blue-600 border border-blue-600" @click="cancelClicked" value="Cancel" />
				<input
					type="submit"
					class="px-4 py-2 uppercase font-bold text-blue-600 border border-blue-600"
					value="Save" />
			</div>
		</form>
	</div>
</template>