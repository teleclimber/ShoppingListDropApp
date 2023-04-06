import type {Context} from "https://deno.land/x/dropserver_app@v0.2.1/mod.ts";

import { getCategories, editCategory, createCategory } from "../models/categories.ts";
import type { Category, CategoryData } from '../app_types.ts';

export async function getAllCategories(ctx:Context) {
	let categories:Category[];
	try {
		categories = await getCategories();
	} catch(e) {
		ctx.respondWith(new Response(e, {status:500}));
		return;
	}
	ctx.respondWith(Response.json(categories));
}

export async function postCategory(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in postCategory");

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		ctx.respondStatus(400, e);
		return;
	}

	const category_data = validateCategoryData(data);

	let new_id;
	try {
		new_id = await createCategory( category_data );
	}
	catch(e) {
		ctx.respondStatus(500, e);
		return;
	}

	ctx.respondJson({category_id:new_id});
}

export async function putCategory(ctx:Context) {
	if( ctx.proxyId === null ) throw new Error("got a null proxy_id in putCategory");
	const params = <{id:string}>ctx.params;

	let data;
	try {
		data = await ctx.request.json();
	}
	catch(e) {
		ctx.respondStatus(400, e);
		return;
	}

	const category_id = Number(params.id);
	const category_data = validateCategoryData(data);

	try {
		await editCategory( category_id, category_data );
	}
	catch(e) {
		ctx.respondStatus(500, e);
		return;
	}

	ctx.respondStatus(200, "ok");
}

function validateCategoryData(data:any) :CategoryData {
	const sort_order = Number(data.sort_order);
	if( isNaN(sort_order) ) throw new Error("category sort order is not a number");
	return {
		name: validateName(data.name),
		sort_order
	};
}

function validateName(data:any) :string {
	if( typeof data !== 'string' ) throw new Error("cat name: expected string");
	data = data.trim();
	if( data.length === 0 || data.length > 50 ) throw new Error("item name: should be between 1 and 50 characters");
	return data;
}