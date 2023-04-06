
export interface User {
	proxy_id: string,
	display_name: string,
	avatar: string
}

export enum ItemStatus {
	stocked = "stocked",
	buy = "buy",
	inCart = "in-cart"
}

export type ItemData = {
	//[key: string]: string|number|boolean|Date|null;
	name: string,
	description: string,
	image: string,
	category_id: number,	// TODO consider making that number|null (we currently use -1)
	check_stock: boolean,
	deleted: Date|null
}

type ItemItemID = {
	item_id: number
}

export type ItemCurStatus = {
	cur_status: ItemStatus
}

export type Item = ItemData & ItemItemID & ItemCurStatus;

// export interface Item extends ItemData {
// 	item_id: number,
// 	cur_status: ItemStatus
// }

export type StoreIds = {
	store_ids: number[]
}
export type ItemPlus = Item & StoreIds;

export type InsertItem = ItemData & ItemCurStatus;

export type InsertItemPlus = InsertItem & StoreIds;

export type UpdateItem = ItemItemID & ItemData & ItemCurStatus;

type HistoryMeta = {
	proxy_id: string,
	datetime: Date
}

export type ItemHistory = ItemData & ItemItemID & HistoryMeta;

export type ItemStatusData = {
	item_id: number,
	proxy_id: string,
	datetime: Date,
	status: ItemStatus
}

/// Stores:

export type StoreData = {
	name: string
}

type StoreStoreID = {
	store_id: number
}

export type Store = StoreData & StoreStoreID;

// Categories

export type CategoryData = {
	name: string,
	sort_order: number
}

export type CategoryCategoryID = {
	category_id: number
}

export type Category = CategoryData & CategoryCategoryID;