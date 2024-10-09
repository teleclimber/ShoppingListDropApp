import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { assertEquals } from "jsr:@std/assert";
import '../../ds_test/index.ts';
import {db} from '../db.ts';
import {createStore, getStore, editStore} from './stores.ts';
import type { StoreData } from '../app_types.ts';
import {upTo1, upTo2} from '../migrations.ts';


Deno.test({
	name:"Create store then get",
	fn: () => {
		const handle = new DB();
		upTo1(handle);
		upTo2(handle);

		db.setHandle(handle);

		const store_data:StoreData = {
			name: "store1",
			categories: [77, 11]
		};
		const store_id = createStore(store_data);

		const db_store = getStore(store_id);
		const expected_store = Object.assign({store_id}, store_data);
		assertEquals(db_store, expected_store);

	}
});

Deno.test({
	name:"Edit categories",
	fn: () => {
		const handle = new DB();
		upTo1(handle);
		upTo2(handle);

		db.setHandle(handle);

		const store_data:StoreData = {
			name: "store1",
			categories: [77, 11]
		};
		const store_id = createStore(store_data);

		store_data.categories = [];
		editStore(store_id, store_data);
		let db_store = getStore(store_id);
		let expected_store = Object.assign({store_id}, store_data);
		assertEquals(db_store, expected_store);

		store_data.categories = [66];
		editStore(store_id, store_data);
		db_store = getStore(store_id);
		expected_store = Object.assign({store_id}, store_data);
		assertEquals(db_store, expected_store);
	}
});

// create then upate then get...