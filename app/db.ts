import app from './app.ts';
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";

const dbFilename = "shopping.db";

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