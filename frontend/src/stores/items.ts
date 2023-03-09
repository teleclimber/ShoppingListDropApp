import { ShallowRef, shallowRef, computed } from 'vue';
import { defineStore } from 'pinia';
import {ItemPlus, AddItem, UpdateItem, ItemStatus} from '../../../app/types';

export const useItemsStore = defineStore('items', () => {
	
	const it :Map<number,ShallowRef<ItemPlus>> = new Map;
	it.set(1, shallowRef({
		item_id: 1,
		cur_status: ItemStatus.buy,
		name: "pasta",
		description: "for ums",
		image: "",
		category_id: 4,
		check_stock: true,
		deleted: null,
		store_ids: [1]
	}));
	it.set(2, shallowRef({
		item_id: 2,
		cur_status: ItemStatus.stocked,
		name: "Tomato Sauce",
		description: "for oli",
		image: "",
		category_id: 5,
		check_stock: true,
		deleted: null,
		store_ids: [2,3]
	}));
	const items :ShallowRef<Map<number,ShallowRef<ItemPlus>>> = shallowRef(it);

	const ordered_items = computed( () => {
		const ret :ShallowRef<ItemPlus>[] = [];
		items.value.forEach( i => {
			ret.push(i);
		});
		return ret;
	})

	let next_item_id = 3;
	
	function getItem(item_id: number) :ShallowRef<ItemPlus>|undefined {
		const item = items.value.get( item_id );
		if( item ) return item;
	}
	function mustGetItem(item_id: number) :ShallowRef<ItemPlus> {
		const item = getItem(item_id);
		if(!item) throw new Error("item not found for id: "+item_id);
		return item;
	}
	
	function addItem(add_item :AddItem) :number {
		const item_id = next_item_id;
		next_item_id++;
		const item = Object.assign({item_id}, add_item)
		items.value.set(item_id, shallowRef(item));
		items.value = new Map(items.value);
		return item_id;
	}
	function editItem(update_item: ItemPlus) {
		const item_id = update_item.item_id;
		const item = mustGetItem(item_id);
		item.value = update_item;
		// Will need to do some work on the backend to update all the tables as needed
	}
	
	function setItemStatus(item_id: number, cur_status: ItemStatus) {
		const item = mustGetItem(item_id);
		item.value = Object.assign({}, item.value, {cur_status});
	}

	return {items, ordered_items, addItem, editItem, setItemStatus, getItem, mustGetItem};
});
