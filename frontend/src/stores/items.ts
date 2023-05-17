import { ShallowRef, shallowRef, ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LoadState } from './common';
import {ItemPlus, InsertItemPlus, ItemStatus, ItemData, ItemCurStatus, ItemStores} from '../../../app/app_types';
import { gFetch } from './response_guard';

export const useItemsStore = defineStore('items', () => {
	const load_state = ref(LoadState.NotLoaded);
	const is_loaded = computed( () => load_state.value === LoadState.Loaded );

	const items :ShallowRef<Map<number,ShallowRef<ItemPlus>>> = shallowRef(new Map);

	async function loadData() {
		if( load_state.value !== LoadState.NotLoaded ) return;
		load_state.value = LoadState.Loading;
		const resp = await gFetch("/api/items");
		const json = await resp.json() as ItemPlus[];
		if( !Array.isArray(json) ) throw new Error("expected array for dropds, got "+typeof resp.json);
		const it :Map<number,ShallowRef<ItemPlus>> = new Map; 
		json.forEach( (raw) => {
			const d = itemPlusFromRaw(raw);
			it.set(d.item_id, shallowRef(d));
		});
		items.value = it;
		load_state.value = LoadState.Loaded;
	}

	const ordered_items = computed( () => {
		const ret :ShallowRef<ItemPlus>[] = [];
		items.value.forEach( i => {
			ret.push(i);
		});
		return ret;
	})

	function getItem(item_id: number) :ShallowRef<ItemPlus>|undefined {
		const item = items.value.get( item_id );
		if( item ) return item;
	}
	function mustGetItem(item_id: number) :ShallowRef<ItemPlus> {
		const item = getItem(item_id);
		if(!item) throw new Error("item not found for id: "+item_id);
		return item;
	}
	
	async function addItem(add_item :InsertItemPlus) :Promise<number> {
		// const item_id = next_item_id;
		// next_item_id++;
		// Here I'd really like for the UI to be very fast.
		// So idally don't wait for the server to respond.
		const resp = await gFetch("/api/items", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(add_item)
		});
		if( !resp.ok ) throw new Error("did not get OK");
		const data = await resp.json();
		const item_id = data.item_id;
		const item = Object.assign({item_id}, add_item)
		items.value.set(item_id, shallowRef(item));
		items.value = new Map(items.value);
		return item_id;
	}
	async function editItem(item_id: number, update_item: ItemData & ItemCurStatus & ItemStores) {
		const item = mustGetItem(item_id);
		const resp = await gFetch("/api/items/"+item_id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(update_item)
		});
		if( !resp.ok ) throw new Error("did not get OK");
		
		item.value = Object.assign({item_id}, update_item );
		// Will need to do some work on the backend to update all the tables as needed
	}
	
	async function setItemStatus(item_id: number, cur_status: ItemStatus) {
		const item = mustGetItem(item_id);
		item.value = Object.assign({}, item.value, {cur_status});
		const resp = await gFetch("/api/items/"+item_id, {
			method: "PATCH",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({cur_status})
		});
		if( !resp.ok ) throw new Error("did not get OK");
	}

	async function batchSetItemStatus(item_ids:number[], cur_status:ItemStatus) {
		item_ids.forEach( i => {
			const item = mustGetItem(i);
			item.value = Object.assign({}, item.value, {cur_status});
		});
		const resp = await gFetch("/api/items", {
			method: "PATCH",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({item_ids,cur_status})
		});
		if( !resp.ok ) throw new Error("did not get OK");
	}

	return {loadData, is_loaded, items, ordered_items, addItem, editItem, setItemStatus, batchSetItemStatus, getItem, mustGetItem};
});

function itemPlusFromRaw(data:any) :ItemPlus {
	return {
		item_id: Number(data.item_id),
		cur_status: data.cur_status,
		name: data.name+'',
		description: data.description+'',
		image: "",
		category_id: Number(data.category_id),
		generic: !!data.generic,
		check_stock: !!data.check_stock,
		deleted: data.deleted ? new Date(data.Deleted) : null,
		store_ids: Array.isArray(data.store_ids) ? data.store_ids.map( (s:any) => Number(s)) : []
	}
}