import { RoutesBuilder, AuthAllow } from 'https://deno.land/x/dropserver_app@v0.2.2/mod.ts';
import { getCurrentUser } from './handlers/users.ts';
import { getAllItems, postItem, putItem, patchItemStatus, patchBatchItemsStatus } from './handlers/items.ts';
import { getAllStores, postStore, putStore } from './handlers/stores.ts';
import { getAllCategories, postCategory, putCategory, patchCategories } from './handlers/categories.ts';

export default function createRoutes() {
	const r = new RoutesBuilder;

	const authorized = {allow: AuthAllow.authorized};

	r.add("get", "/api/current-user", authorized, getCurrentUser)

	r.add('get', '/api/items', authorized, getAllItems );
	r.add('post', '/api/items', authorized, postItem );
	r.add('put', '/api/items/:id', authorized, putItem );
	r.add('patch', '/api/items/:id', authorized, patchItemStatus );
	r.add('patch', '/api/items', authorized, patchBatchItemsStatus );

	r.add('get', '/api/stores', authorized, getAllStores );
	r.add('post', '/api/stores', authorized, postStore );
	r.add('put', '/api/stores/:id', authorized, putStore );

	r.add('get', '/api/categories', authorized, getAllCategories );
	r.add('post', '/api/categories', authorized, postCategory );
	r.add('put', '/api/categories/:id', authorized, putCategory );
	r.add('patch', '/api/categories', authorized, patchCategories );

	// avatars: 
	r.add("get", {path:"/avatars", end: false}, authorized, r.staticFileHandler({path:'@avatars/'}));

	// frontend
	r.add("get", "/", authorized, r.staticFileHandler({path:'@app/frontend/index.html'}));
	r.add("get", {path: "/assets/", end: false}, authorized, r.staticFileHandler({path:'@app/frontend/assets/'}));
	r.add("get", {path: "/static/", end: false}, authorized, r.staticFileHandler({path:'@app/frontend/static/'}));

	// Paths that should return index.html
	// These are from the frontend router. 
	['/stores', '/add-store', '/edit-store',
		'/categories', '/add-category', '/edit-category',
		'/add', '/edit',
		'/shop'].forEach( p => {
			r.add("get", {path:p, end:false}, authorized, r.staticFileHandler({path:'@app/frontend/index.html'}));
		});

	// Any other path that gets requested gets the frontend index.
	r.add("get", {path:"/", end:false}, authorized, r.staticFileHandler({path:'@app/frontend/'}));

	return r.routes
}