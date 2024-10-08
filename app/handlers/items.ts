import type {Context} from "https://deno.land/x/dropserver_app@v0.2.2/mod.ts";

import {getItemsPlus, createItem, updateItem, updateItemStatus, updateMultipleItemsStatus }  from '../models/items.ts';
import type {Item, ItemData, ItemStatus} from '../app_types.ts';

export async function getAllItems(ctx:Context) {
	let items:Item[];
	try {
		items = await getItemsPlus();
	} catch(e) {
		if (e instanceof Error) ctx.respondWith(new Response(e.toString(), {status:500}));
		return;
	}
	ctx.respondWith(Response.json(items));
}

export async function postItem(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(400, e.toString());
		return;
	}

	const item_data = validateItemData(data);
	const cur_status = validateStatus(data.cur_status)
	const store_ids = validateStores(data.store_ids);

	let new_id;
	try {
		new_id = await createItem( ctx.proxyId, item_data, cur_status, store_ids );
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(500, e.toString());
		return;
	}

	ctx.respondJson({item_id:new_id});
}

export async function putItem(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");
	const params = <{id:string}>ctx.params;

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(400, e.toString());
		return;
	}

	const item_id = Number(params.id);
	const item_data = validateItemData(data);
	const cur_status = validateStatus(data.cur_status)
	const store_ids = validateStores(data.store_ids);

	try {
		await updateItem( item_id, ctx.proxyId, item_data, cur_status, store_ids );
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(500, e.toString());
		return;
	}

	ctx.respondStatus(200, "ok");
}

export async function patchItemStatus(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");
	const params = <{id:string}>ctx.params;

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(400, e.toString());
		return;
	}

	const item_id = Number(params.id);
	const cur_status = validateStatus(data.cur_status);

	try {
		updateItemStatus( item_id, ctx.proxyId, cur_status );
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(500, e.toString());
		return;
	}

	ctx.respondStatus(200, "ok");
}

export async function patchBatchItemsStatus(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");
	
	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(400, e.toString());
		return;
	}

	if( !Array.isArray(data.item_ids) ) {
		ctx.respondStatus(400, "item_ids is not an array");
		return;
	}
	const item_ids = data.item_ids.map( (i:number) => Number(i));
	const cur_status = validateStatus(data.cur_status);

	try {
		updateMultipleItemsStatus( item_ids, ctx.proxyId, cur_status );
	}
	catch(e) {
		if (e instanceof Error) ctx.respondStatus(500, e.toString());
		return;
	}

	ctx.respondStatus(200, "ok");
}

// export async function patchItem(ctx:Context) {
// 	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

// 	let data;
// 	try {
// 		data = await ctx.request.json();
// 	}
// 	catch(e) {
// 		ctx.respondStatus(400, e);
// 		return;
// 	}

// 	const item_data = validateItemData(data);
// 	const cur_status = validateStatus(data.cur_status)
// 	const store_ids = validateStoreIds(data.store_ids);

// 	let new_id;
// 	try {
// 		new_id = await createItem( ctx.proxyId, item_data, cur_status, store_ids );
// 	}
// 	catch(e) {
// 		ctx.respondStatus(500, e);
// 		return;
// 	}

// 	ctx.respondWith(Response.json({id:new_id}));
// }

function validateItemData(data:any) :ItemData {
	return {
		name: validateName(data.name),
		description: validateDescription(data.description),
		category_id: Number(data.category_id),
		generic: !!data.generic,
		check_stock: !!data.check_stock,
		deleted: null,
		image: '',	//temp
	};
}

function validateName(data:any) :string {
	if( typeof data !== 'string' ) throw new Error("item name: expected string");
	data = data.trim();
	if( data.length === 0 || data.length > 100 ) throw new Error("item name: should be between 1 and 100 cahracters");
	return data;
}
function validateDescription(data:any) :string {
	if( typeof data !== 'string' ) throw new Error("item description: expected string");
	data = data.trim();
	if( data.length > 1000 ) throw new Error("item description: should be at most 1000 cahracters");
	return data;
}
// function validateCategoryId(data: any) {
// 	if( typeof data !== "number" ) throw new Error("item category: expected a number")
// }
function validateStatus(data:any) :ItemStatus {
	switch (data+'') {
		case "stocked":
		case "buy":
		case "in-cart":
			break;
	
		default:
			throw new Error("unexpected ItemStatus value: "+data);
	}
	return data+'' as ItemStatus;
}
function validateStores(data:any) :number[] {
	if( !Array.isArray(data) ) throw new Error("store_ids: expected an array");
	return data.map( d => {
		if( typeof d !== "number" ) throw new Error("expected number for store_id");
		if( d < 0 ) throw new Error("sotre_id: unexpected negative number");
		return d;
	});
}