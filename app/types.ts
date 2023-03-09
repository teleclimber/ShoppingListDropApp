export enum ItemStatus {
	stocked = "stocked",
	buy = "buy",
	inCart = "in-cart"
}

export interface ItemData {
	[key: string]: string|number|boolean|Date|null|number[];
	name: string,
	description: string,
	image: string,
	category_id: number,	// TODO consider making that number|null (we currently use -1)
	check_stock: boolean,
	deleted: Date|null
}

export interface Item extends ItemData {
	item_id: number,
	cur_status: ItemStatus // TODO why string?
}

export interface ItemPlus extends Item {
	store_ids: number[]
}

export interface InsertItem extends ItemData {
	cur_status: ItemStatus
}

export interface AddItem extends InsertItem {
	store_ids: number[]
}

export interface UpdateItem extends ItemData {
	item_id: number
}

export interface ItemHistory extends ItemData {
	item_id: number,
	proxy_id: string,
	datetime: Date
}

export interface ItemStatusData {
	[key: string]: string|number|boolean|Date;
	item_id: number,
	proxy_id: string,
	datetime: Date,
	status: ItemStatus
}