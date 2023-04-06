import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";
import '../../ds_test/index.ts';
import {db} from '../db.ts';
import {createStore, getStore} from './stores.ts';
import type { StoreData } from '../app_types.ts';
import {upTo1} from '../migrations.ts';


Deno.test({
	name:"Create store then get",
	fn: () => {
		const handle = new DB();
		upTo1(handle);

		db.setHandle(handle);

		const store_data:StoreData = {
			name: "store1"
		};
		const store_id = createStore(store_data);

		const db_store = getStore(store_id);
		const expected_store = Object.assign({store_id}, store_data);
		assertEquals(db_store, expected_store);

	}
});

// create then upate then get...