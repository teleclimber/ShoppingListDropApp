import type {Context} from "https://deno.land/x/dropserver_app@v0.2.1/mod.ts";

import { getStores, getStore, createStore, editStore } from "../models/stores.ts";
import type { Store, StoreData } from '../app_types.ts';

export async function getAllStores(ctx:Context) {
	let stores:Store[];
	try {
		stores = await getStores();
	} catch(e) {
		ctx.respondWith(new Response(e, {status:500}));
		return;
	}
	ctx.respondWith(Response.json(stores));
}

export async function postStore(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postLeftoverItem");

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		ctx.respondStatus(400, e);
		return;
	}

	const store_data = validateStoreData(data);

	let new_id;
	try {
		new_id = await createStore( store_data );
	}
	catch(e) {
		ctx.respondStatus(500, e);
		return;
	}

	ctx.respondJson({store_id:new_id});
}

export async function putStore(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in putStore");
	const params = <{id:string}>ctx.params;

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		ctx.respondStatus(400, e);
		return;
	}

	const store_id = Number(params.id);
	const store_data = validateStoreData(data);

	try {
		await editStore( store_id, store_data );
	}
	catch(e) {
		ctx.respondStatus(500, e);
		return;
	}

	ctx.respondStatus(200, "ok");
}

function validateStoreData(data:any) :StoreData {
	return {
		name: validateName(data.name),
	};
}

function validateName(data:any) :string {
	if( typeof data !== 'string' ) throw new Error("store name: expected string");
	data = data.trim();
	if( data.length === 0 || data.length > 50 ) throw new Error("item name: should be between 1 and 50 characters");
	return data;
}