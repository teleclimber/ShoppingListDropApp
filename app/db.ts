// this app needs a good db schema.

// - item: item_id, name, image, desc, check_stock, cur_status
// - item_history: item_id, proxy_id, datetime, name, image, desc, check_stock
// - item_status: item_id, proxy_id, datetime, status

// "check_stock" means the item's stock level is monitored: food items, TP, detergents, etc... all "depletables"
// status is: stocked, buy, [buy NOW!]
// - store: store_id, name, (...) 
// ^^not a specific store, but a genre?
// ^^But also maybe a specific store bc some things can only be had a specific stores

// - category: category_id, name
// ^^ basically narrowing down by type of product so you can be organized when shopping
// ex: fruits/veg, frozen, dairy, alcohol, ...
// also: electrical, ... although category should be fully optional bc pia

// - item-store: item_id, store_id

// [we may need a "context"? A way to attach items to a specific thing, like a camping trip]

// What's the "go-shopping" mode?
// - shop-list: list_id, datetime, created_by proxy_id
// - shop-list-items: list_id, item_id, in_cart

// Shoping list lifecycle:
// * Create list
// * specify store(s) to autopopulate list items
// * manually add/remove list items
// * when shopping, hit checkmark to indicate "in cart"
// * Done shopping -> click "Done" which moves "in cart" 
//   -> items to status "stocked" or "bought" and archives the list.





// - stores: nameish, parent, desc, logo
// - item-stores: (maybe, maybe just stickit in a col in items?)
// - item-status: This is stock level / urgency to buy...
//    buy-now (meaning it shows on list), time to depletion (or check again in), ...?
// - item-category ? like food/frozen, food/vegetables, ...
//   ..this helps to see things in a useful order in lists

// amid all this we should have historical data, because it seems
// I always wish I had it.

// We may want to see historical view of an item's purchases? Or is that outside the scope?


import app from './app.ts';
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";

const dbFilename = "shopping.db";

// export default function getDB() :DB {
// 	if( db === undefined ) {
		
// 	}
// 	return db;
// }

// export function () :DB {
// 	if( db === undefined ) db = new DB(app.appspacePath(dbFilename), {mode:"create"});
// 	return db;
// }

export function getDBFile() :string {
	return app.appspacePath(dbFilename);
}

class dbClass {
	#handle :DB|undefined;
	setHandle(h :DB) {
		this.#handle = h;
	}
	getCreateDB() :DB {
		this.#handle = new DB(app.appspacePath(dbFilename), {mode:"create"});
		return this.#handle;
	}
	get handle() :DB {
		if( this.#handle === undefined ) this.#handle = new DB(app.appspacePath(dbFilename), {mode:"write"});
		return this.#handle;
	}
}

export const db = new dbClass;