import {db} from '../db.ts';
import type { Store, StoreData } from '../app_types.ts';

const insertStoreSQL = `
INSERT INTO stores 
("name") VALUES
(:name)
`;
export function createStore(data: StoreData) :number {
	let last_id :number|undefined;
	db.handle.transaction( () => {
		const {categories, ...row_data} = data;
		db.handle.query(insertStoreSQL, row_data);
		last_id = db.handle.lastInsertRowId;
		setStoreCategories(last_id, categories);
	});
	if( last_id === undefined ) throw new Error("something went wrong. We didn't get a store id");
	return last_id;
}

const updateStoreSQL = `
UPDATE stores SET
name=:name
WHERE store_id=:store_id
`;
export function editStore(store_id: number, data:StoreData) {
	db.handle.transaction( () => {
		const {categories, ...row_data} = data;
		db.handle.query(updateStoreSQL, Object.assign({store_id}, row_data));
		setStoreCategories(store_id, categories);
	});
}


function setStoreCategories(store_id: number, store_cats:number[]) {
	db.handle.transaction( () => {
		db.handle.query('DELETE FROM store_categories WHERE store_id = :store_id', {store_id});
		store_cats.forEach( category_id => {
			db.handle.query('INSERT INTO store_categories (store_id, category_id) VALUES (:store_id, :category_id)', {store_id, category_id});
		});
	});
}

function getStoreCategories(store_id: number):number[] {
	const rows = db.handle.queryEntries<{category_id:number}>('SELECT category_id FROM store_categories WHERE store_id = :store_id', {store_id});
	return rows.map( r => r.category_id );
}

//delete

export function getStore(store_id: number) : Store {
	const rows = db.handle.queryEntries<Store>('SELECT * FROM stores WHERE store_id = :store_id', {store_id});
	if( rows.length !== 1 ) throw new Error("store not found: "+store_id);
	return Object.assign( rows[0], {categories: getStoreCategories(store_id)})
}

export function getStores() :Store[] {
	const rows = db.handle.queryEntries<Store>('SELECT * FROM stores');
	return rows.map( r => {
		return Object.assign(r, {categories: getStoreCategories(r.store_id)})
	});
}