// stub for dropserver lib to permit testing on Deno-only:
// basically rip things off of denosandboxcode until you can get it to work.

import type libSupportIface from 'https://deno.land/x/dropserver_lib_support@v0.2.1/mod.ts';
import type {GetMigrationsCallback, GetAppRoutesCallback, User} from 'https://deno.land/x/dropserver_lib_support@v0.2.1/mod.ts';

class Migrations {
	setCallback(cb:GetMigrationsCallback) :void {

	}
}
class AppRoutes {
	setCallback(cb:GetAppRoutesCallback) :void {

	}
}
class Users {
	get(proxyId: string) :Promise<User> {
		throw new Error("user not found");
	}
	getAll() :Promise<User[]> {
		return Promise.resolve([])
	}
}

class LibSupport {
	// these are pretty easy, just create temporary dir.
	get appPath() {
		return "";
	}
	get appspacePath() {
		return "";
	}
	get avatarsPath() {
		return "";
	}

	_migrations: Migrations|undefined;
	get migrations() :Migrations {
		if( this._migrations === undefined ) {
			this._migrations = new Migrations;
		}
		return this._migrations;
	}

	_appRoutes: AppRoutes|undefined;
	get appRoutes() :AppRoutes {
		if( this._appRoutes === undefined ) {
			this._appRoutes = new AppRoutes;
		}
		return this._appRoutes;
	}

	get users() :Users {
		return new Users
	}
}

const w = <{["DROPSERVER"]?:libSupportIface}>globalThis;
const libSupport = new LibSupport();
w["DROPSERVER"] = libSupport;