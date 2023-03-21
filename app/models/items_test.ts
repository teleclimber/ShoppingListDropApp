import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";
import '../../ds_test/index.ts';
import {db} from '../db.ts';
import {createItem, updateItemStatus, getItems, getItemsPlus, getItemHistory, getStatusHistory} from './items.ts';
import { ItemData, ItemStatus } from '../app_types.ts';
import {upTo1} from '../migrations.ts';

Deno.test({
	name:"Create item, then get item and history",
	fn: () => {
		const handle = new DB();
		upTo1(handle);

		db.setHandle(handle);

		const proxy_id = "abc";
		const item_data:ItemData = {
			category_id: 1,
			check_stock: true,
			deleted: null,
			description: "test item 1",
			image:"def.jpg",
			name: "item1"
		};
		const item_id = createItem(proxy_id, item_data, ItemStatus.stocked, [22,77]);

		const items = getItems();
		if( items.length !== 1 ) throw new Error("expected one item");
		const db_item = items[0];
		const expected_item = Object.assign({item_id, cur_status:ItemStatus.stocked}, item_data);
		assertEquals(db_item, expected_item);

		const items_plus = getItemsPlus();
		if( items_plus.length !== 1 ) throw new Error("expected one item");
		const db_item_plus = items_plus[0];
		const expected_item_plus = Object.assign({item_id, cur_status:ItemStatus.stocked, store_ids:[22, 77]}, item_data);
		assertEquals(db_item_plus, expected_item_plus);

		const item_history = getItemHistory(item_id);
		if( item_history.length !== 1 ) throw new Error("expected one history item");
		const expected_item_history = Object.assign({item_id, proxy_id, datetime:item_history[0].datetime}, item_data);
		assertEquals(item_history[0], expected_item_history);

		const status_history = getStatusHistory(item_id);
		if( status_history.length !== 1 ) throw new Error("expected one history item");
		const expected_status_history = {item_id, proxy_id, datetime:status_history[0].datetime, status:ItemStatus.stocked};
		assertEquals(status_history[0], expected_status_history);
	}
});

Deno.test({
	name:"Create item, update status, then get item and history",
	fn: () => {
		const handle = new DB();
		upTo1(handle);

		db.setHandle(handle);

		const proxy_id = "abc";
		const item_data:ItemData = {
			category_id: 1,
			check_stock: true,
			deleted: null,
			description: "test item 1",
			image:"def.jpg",
			name: "item1"
		};
		const item_id = createItem(proxy_id, item_data, ItemStatus.stocked);

		updateItemStatus(item_id, proxy_id, ItemStatus.buy);
		
		const expected_item = Object.assign({item_id, cur_status:ItemStatus.buy}, item_data);
		const items = getItems();
		if( items.length !== 1 ) throw new Error("expected one item");
		const db_item = items[0];
		assertEquals(db_item, expected_item);

		const item_history = getItemHistory(item_id);
		if( item_history.length !== 1 ) throw new Error("expected one history item");
		const expected_item_history = Object.assign({item_id, proxy_id, datetime:item_history[0].datetime}, item_data);
		assertEquals(item_history[0], expected_item_history);

		const status_history = getStatusHistory(item_id);
		if( status_history.length !== 2 ) throw new Error("expected two history items");
		// const expected_status_history = {item_id, proxy_id, datetime:status_history[0].datetime, status:ItemStatus.stocked};
		assertEquals(status_history[0], {item_id, proxy_id, datetime:status_history[0].datetime, status:ItemStatus.stocked});
		assertEquals(status_history[1], {item_id, proxy_id, datetime:status_history[1].datetime, status:ItemStatus.buy});
	}
});



// test
// - update item data (check item data and history, and status history should be unchanged)
// - 
