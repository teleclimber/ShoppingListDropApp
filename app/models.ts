import getDB from '../db.ts';

export enum ItemStatus {
	stocked = "stocked",
	buy = "buy"
}

export interface ItemData {
	name: string,
	description: string,
	image: string,
	category_id: number,
	check_stock: boolean,
}

export interface Item extends ItemData {
	id: number,
	cur_status: number
}

interface InsertItem extends ItemData {
	proxy_id: string,
	cur_status: string
}

interface InsertItemHistory extends ItemData {
	item_id: number,
	proxy_id: string,
	datetime: Date
}

interface InsertItemStatus {
	item_id: number,
	proxy_id: string,
	datetime: Date,
	status: string
}


export function createItem(proxy_id:string, data: ItemData, cur_status: ItemStatus) :number {
	const db = getDB();

	const ins_item :InsertItem = Object.assign({proxy_id, cur_status}, data)
	db.query('INSERT INTO items ("name", "description", "image", "check_stock", "category_id", "cur_status") '
		+' VALUES (:name, :description, :image, :check_stock, :category_id, :cur_status)', ins_item);
	const item_id = db.lastInsertRowId;

	const datetime = new Date;
	const ins_history :InsertItemHistory = Object.assign({item_id, proxy_id, datetime}, data);
	db.query('INSERT INTO items_history ("item_id", "proxy_id", "datetime", "name", "description", "image", "check_stock", "category_id") '
		+' VALUES (:item_id, :proxy_id, :datetime, :name, :description, :image, :check_stock, :category_id)', ins_history);
	
	const ins_status :InsertItemStatus = {item_id, proxy_id, datetime, status:cur_status};
	db.query('INSERT INTO items_status ("item_id", "proxy_id", "datetime", "status") '
		+' VALUES (:item_id, :proxy_id, :datetime, :status)', ins_status);

	return item_id;
}