import {db} from '../db.ts';
import { ItemStatus, ItemData, UpdateItem, ItemHistory, ItemStatusData, Item, ItemPlus } from '../app_types.ts';

const insertItemSQL = `
INSERT INTO items
("name", "description", "image", "category_id", "check_stock", "deleted", "cur_status") VALUES
(:name,  :description,  :image,  :category_id,  :check_stock,  :deleted,  :cur_status)
`;

export function createItem(proxy_id:string, data: ItemData, cur_status:ItemStatus, store_ids: number[] = []) :number {
	let item_id = -1;
	db.handle.transaction( () => {
		db.handle.query(insertItemSQL, Object.assign({cur_status}, data));
		item_id = db.handle.lastInsertRowId;

		const datetime = new Date;
		insertItemHistory(item_id, proxy_id, datetime, data);
		insertItemStatus(item_id, proxy_id, datetime, cur_status);

		setItemStores(item_id, store_ids);
	});
	return item_id;
}

const updateItemSQL = `
UPDATE items SET
name=:name,
description=:description,
image=:image,
category_id=:category_id,
check_stock=:check_stock,
deleted=:deleted,
cur_status=:cur_status
WHERE item_id=:item_id
`;

export function updateItem(item_id:number, proxy_id:string, data: ItemData, cur_status:ItemStatus, store_ids: number[] = []) {
	db.handle.transaction( () => {
		const update_item :UpdateItem = Object.assign({item_id, cur_status}, data);
		db.handle.query(updateItemSQL, update_item);
		
		const datetime = new Date;
		insertItemHistory(item_id, proxy_id, datetime, data);
		insertItemStatus(item_id, proxy_id, datetime, cur_status);
		
		setItemStores(item_id, store_ids);
	});
}

const updateItemStatusSQL = `
UPDATE items SET
cur_status=:status
WHERE item_id=:item_id
`;

export function updateItemStatus(item_id:number, proxy_id:string, status: ItemStatus) {
	db.handle.transaction( () => {
		db.handle.query(updateItemStatusSQL, {item_id, status});
		insertItemStatus(item_id, proxy_id, new Date, status);
	});
}

export function updateMultipleItemsStatus(item_ids:number[], proxy_id:string, status: ItemStatus) {
	db.handle.transaction( () => {
		item_ids.forEach( item_id => {
			db.handle.query(updateItemStatusSQL, {item_id, status});
			insertItemStatus(item_id, proxy_id, new Date, status);
		});
	});
}

const insertItemHistorySQL = `
INSERT INTO items_history
("item_id", "proxy_id", "datetime", "name", "description", "image", "category_id", "check_stock", "deleted") VALUES
(:item_id,  :proxy_id,  :datetime,  :name,  :description,  :image,  :category_id,  :check_stock,  :deleted)
`;
function insertItemHistory(item_id:number, proxy_id:string, datetime:Date, data:ItemData) {
	const ins_history :ItemHistory = Object.assign({item_id, proxy_id, datetime}, data);
	db.handle.query(insertItemHistorySQL, ins_history);
}

function insertItemStatus(item_id: number, proxy_id: string, datetime:Date, status:ItemStatus) {
	const ins_status :ItemStatusData = {item_id, proxy_id, datetime, status};
	db.handle.query('INSERT INTO items_status ("item_id", "proxy_id", "datetime", "status") '
		+' VALUES (:item_id, :proxy_id, :datetime, :status)', ins_status);
}

function setItemStores(item_id:number, store_ids:number[]) {
	db.handle.transaction( () => {
		db.handle.query('DELETE FROM item_store WHERE item_id = :item_id', {item_id});
		store_ids.forEach( store_id => {
			db.handle.query('INSERT INTO item_store	(item_id, store_id) VALUES (:item_id, :store_id)', {item_id, store_id});
		});
	});
}

// TODO delete item

// getters:
export function getItems() {
	const rows = db.handle.queryEntries<Item>('SELECT * FROM items');
	rows.forEach( r => r.check_stock = !!r.check_stock );	// make check_stock an actual boolean (it comes out as integer from DB)
	return rows;
}

export function getItemsPlus() {
	let item_plus :ItemPlus[] = [];
	db.handle.transaction( () => {
		const items = getItems();
		item_plus = items.map( itemWithStores );
	});
	return item_plus;
}

export function itemWithStores(item:Item) :ItemPlus {
	const rows = db.handle.queryEntries<{item_id:number, store_id: number}>('SELECT * FROM item_store WHERE item_id = :item_id', {item_id:item.item_id});
	return Object.assign({store_ids: rows.map(r => r.store_id)}, item)
}

export function getItemHistory(item_id: number) {
	const rows = db.handle.queryEntries<ItemHistory>('SELECT * FROM items_history WHERE item_id = :item_id', {item_id});
	// TODO order by datetime descending, then also allow paging.
	rows.forEach( r => r.check_stock = !!r.check_stock );	// make check_stock an actual boolean (it comes out as integer from DB)
	return rows;
}

export function getStatusHistory(item_id: number) {
	const rows = db.handle.queryEntries<ItemStatusData>('SELECT * FROM items_status WHERE item_id = :item_id', {item_id});
	// TODO order by datetime descending, then also allow paging.
	return rows;
}
