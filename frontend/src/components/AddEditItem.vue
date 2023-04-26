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
const stores :Ref<Map<number, boolean>> = ref(new Map);
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
		stores.value = new Map;
		item.stores.forEach( (s) => {
			stores.value.set(s.store_id, s.there);
		});
		check_stock.value = item.check_stock;
		cur_status.value = item.cur_status;
	}
	else {
		name.value = props.start_name || "";
		description.value = "";
		category_id.value = -1;
		stores.value = new Map;
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
const stores_cat = computed( () => {
	const ret :Map<number,boolean> = new Map;
	const cat_id = category_id.value;
	storesStore.sorted_stores.forEach( s => {
		ret.set( s.value.store_id, s.value.categories.includes(cat_id) );
	});
	return ret;
});

const store_net = computed( () => {
	const ret :Map<number,boolean> = new Map;
	storesStore.sorted_stores.forEach( s => {
		const store_id = s.value.store_id;
		if( stores.value.has(store_id) ) {
			const is_in = stores.value.get(store_id);
			if( is_in === undefined ) throw new Error('unexpected undefined');
			ret.set( store_id, is_in );
		}
		else {
			const is_in = stores_cat.value.get(store_id);
			if( is_in === undefined ) throw new Error('unexpected undefined');
			ret.set( store_id, is_in );
		}
	});
	return ret;
});

function setStore(store_id:number, is_in:boolean ){
	stores.value.set(store_id, is_in);
}

async function submitClicked() {
	// name can't be blank
	// ideally name should be unique? Or not?
	const n = name.value.trim();
	if( n === "" ) {
		alert("name can't be blank");
		return;
	}

	const stores_data:{store_id:number, there:boolean}[] = [];
	store_net.value.forEach( (there, store_id) => {
		stores_data.push({store_id,there});
	});

	if( props.mode === "add" ) {
		await itemsStore.addItem({
			name: n,
			description: description.value,
			image: "",
			category_id: category_id.value,
			check_stock: check_stock.value,
			deleted: null,
			cur_status: cur_status.value,
			stores: stores_data
		});
	}
	else if( props.mode === "edit" ) {
		if( props.item_id === undefined ) throw new Error("ietm_id should not be undefined if mode is edit");
		await itemsStore.editItem(props.item_id, {
			name: n,
			description: description.value,
			image: "",
			category_id: category_id.value,
			check_stock: check_stock.value,
			deleted: null,
			cur_status: cur_status.value,
			stores: stores_data
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
					<div class="flex items-center border-t" 
						:class="[store_net.get(store.value.store_id)? 'bg-yellow-100' : '']"
						v-for="store in storesStore.sorted_stores">
						<span class="px-4">
							<input type="checkbox"
								:id="'store-ckeck-' + store.value.store_id"
								:checked="store_net.get(store.value.store_id)"
								@input="setStore(store.value.store_id, !store_net.get(store.value.store_id))" />
						</span>
						<label :for="'store-ckeck-' + store.value.store_id" class="py-2 flex-grow">{{ store.value.name }}</label>
						<span v-if="!stores.has(store.value.store_id)" 
							class="px-4 text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
							</svg>
						</span>
					</div>
				</div>
				<p class="mt-1 italic text-gray-500 flex items-baseline">
					<span class="whitespace-nowrap mr-1">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline align-text-bottom w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
						</svg>
						:
					</span>
					determined by store categories
				</p>
			</div>

			<div class="my-6 flex">
				<input id="consumable" type="checkbox" v-model="check_stock" />
				<label for="consumable" class="pl-1 font-medium text-gray-700">
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