import {shallowRef, ShallowRef} from 'vue';
import {ItemPlus, AddItem, ItemStatus} from '../../../app/types';

const items :ShallowRef<ShallowRef<ItemPlus>[]> = shallowRef([
	shallowRef({
		item_id: 1,
		cur_status: ItemStatus.buy,
		name: "pasta",
		description: "for ums",
		image: "",
		category_id: 4,
		check_stock: true,
		deleted: null,
		store_ids: []
}),
shallowRef({
	item_id: 2,
	cur_status: ItemStatus.stocked,
	name: "Tomato Sauce",
	description: "for oli",
	image: "",
	category_id: 5,
	check_stock: true,
	deleted: null,
	store_ids: []
})]);

// get reactive list and items
// should maybe be made read-only?
export function getItems() :ShallowRef<ShallowRef<ItemPlus>[]> {
	return items;
}

export function getItem(item_id: number) :ShallowRef<ItemPlus>|undefined {
	const item = items.value.find( i => i.value.item_id === item_id )
	if( item ) return item;
}
export function mustGetItem(item_id: number) :ShallowRef<ItemPlus> {
	const item = getItem(item_id);
	if(!item) throw new Error("item not found for id: "+item_id);
	return item;
}

export function addItem(add_item :AddItem) :number {
	const item_id = items.value.length;
	const item = Object.assign({item_id}, add_item)
	items.value[item_id] = shallowRef(item);
	items.value = Array.from(items.value);
	return item_id;
}

export function setItemStatus(item_id: number, cur_status: ItemStatus) {
	const item = mustGetItem(item_id);
	item.value = Object.assign({}, item.value, {cur_status});
}