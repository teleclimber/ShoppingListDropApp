import { RoutesBuilder, AuthAllow } from 'https://deno.land/x/dropserver_app@v0.2.1/mod.ts';
import { getAllItems, postItem, putItem, patchItemStatus } from './handlers/items.ts';

export default function createRoutes() {
	const r = new RoutesBuilder;

	const authorized = {allow: AuthAllow.authorized};

	r.add('get', '/api/items', authorized, getAllItems );
	r.add('post', '/api/items', authorized, postItem );
	r.add('put', '/api/items/:id', authorized, putItem );
	r.add('patch', '/api/items/:id', authorized, patchItemStatus );

	// frontend
	r.add("get", "/", authorized, r.staticFileHandler({path:'@app/frontend/index.html'}));
	r.add("get", {path: "/assets/", end: false}, authorized, r.staticFileHandler({path:'@app/frontend/assets/'}));
	r.add("get", {path: "/static/", end: false}, authorized, r.staticFileHandler({path:'@app/frontend/static/'}));
	// Any other path that gets requested gets the frontend index.
	r.add("get", {path:"/", end:false}, authorized, r.staticFileHandler({path:'@app/frontend/index.html'}));

	return r.routes
}