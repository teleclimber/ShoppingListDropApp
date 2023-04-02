import {db} from '../db.ts';
import type { Store, StoreData } from '../app_types.ts';

const insertStoreSQL = `
INSERT INTO stores 
("name") VALUES
(:name)
`;
export function createStore(data: StoreData) :number {
	db.handle.query(insertStoreSQL, data);
	return db.handle.lastInsertRowId;
}

const updateStoreSQL = `
UPDATE stores SET
name=:name
WHERE store_id=:store_id
`;
export function editStore(store_id: number, data:StoreData) {
	db.handle.query(updateStoreSQL, Object.assign({store_id}, data));
}

//delete

export function getStore(store_id: number) : Store {
	const rows = db.handle.queryEntries<Store>('SELECT * FROM stores WHERE store_id = :store_id', {store_id});
	if( rows.length !== 1 ) throw new Error("store not found: "+store_id);
	return rows[0];
}

export function getStores() :Store[] {
	const rows = db.handle.queryEntries<Store>('SELECT * FROM stores');
	return rows;
}