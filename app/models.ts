import getDB from './db.ts';

export enum ItemStatus {
	stocked = "stocked",
	buy = "buy"
}

export interface ItemData {
	[key: string]: string|number|boolean|Date|null;
	name: string,
	description: string,
	image: string,
	category_id: number,
	check_stock: boolean,
	deleted: Date|null
}

export interface Item extends ItemData {
	id: number,
	cur_status: number
}

interface InsertItem extends ItemData {
	proxy_id: string,
	cur_status: string
}

interface UpdateItem extends ItemData {
	item_id: number
}

interface InsertItemHistory extends ItemData {
	item_id: number,
	proxy_id: string,
	datetime: Date
}

interface InsertItemStatus {
	[key: string]: string|number|boolean|Date;
	item_id: number,
	proxy_id: string,
	datetime: Date,
	status: string
}

const insertItemSQL = `
INSERT INTO items
("name", "description", "image", "category_id", "check_stock", "deleted", "cur_status") VALUES
(:name,  :description,  :image,  :category_id,  :check_stock,  :deleted,  :cur_status)
`;

export function createItem(proxy_id:string, data: ItemData, cur_status: ItemStatus) :number {
	const db = getDB();

	let item_id = -1;
	db.transaction( () => {
		const ins_item :InsertItem = Object.assign({proxy_id, cur_status}, data)
		db.query(insertItemSQL, ins_item);
		item_id = db.lastInsertRowId;

		const datetime = new Date;
		insertItemHistory(item_id, proxy_id, datetime, data);
		insertItemStatus(item_id, proxy_id, datetime, cur_status);
	});

	return item_id;
}

const updateItemSQL = `
UPDATE items SET
name=:name,
description=:description,
image=:image,
category_id=:category_id
check_stock=:check_stock,
deleted=:deleted,
cur_status=:cur_status
WHERE item_id=:item_id
`;

export function updateItem(item_id:number, proxy_id:string, data: ItemData) {
	const db = getDB();
	db.transaction( () => {
		const update_item :UpdateItem = Object.assign({item_id}, data)
		db.query(updateItemSQL, update_item);
		insertItemHistory(item_id, proxy_id, new Date, data);
	});
}

const updateItemStatusSQL = `
UPDATE items SET
cur_status=:status
WHERE item_id=:item_id
`;

export function updateItemStatus(item_id:number, proxy_id:string, status: string) {
	const db = getDB();
	db.transaction( () => {
		db.query(updateItemStatusSQL, {item_id, status});
		insertItemStatus(item_id, proxy_id, new Date, status);
	});
}

const insertItemHistorySQL = `
INSERT INTO items_history
("item_id", "proxy_id", "datetime", "name", "description", "image", "category_id", "check_stock", "deleted") VALUES
(:item_id,  :proxy_id,  :datetime,  :name,  :description,  :image,  :category_id,  :check_stock,  :deleted)
`;
function insertItemHistory(item_id:number, proxy_id:string, datetime:Date, data:ItemData) {
	const db = getDB();
	const ins_history :InsertItemHistory = Object.assign({item_id, proxy_id, datetime}, data);
	db.query(insertItemHistorySQL, ins_history);
}

function insertItemStatus(item_id: number, proxy_id: string, datetime:Date, status:string) {
	const db = getDB();
	const ins_status :InsertItemStatus = {item_id, proxy_id, datetime, status};
	db.query('INSERT INTO items_status ("item_id", "proxy_id", "datetime", "status") '
		+' VALUES (:item_id, :proxy_id, :datetime, :status)', ins_status);
}