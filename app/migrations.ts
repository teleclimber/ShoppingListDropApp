import {MigrationsBuilder} from 'https://deno.land/x/dropserver_app@v0.2.2/mod.ts';

import app from './app.ts';
import {db, getDBFile} from './db.ts';
import type { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export default function createMigrations() {
	const m = new MigrationsBuilder;

	m.upTo(1, async () => {
		const dbH = db.getCreateDB();
		upTo1(dbH);
		dbH.close();
	
		// create a dir for the images:
		const images_path = app.appspacePath('images');
		await Deno.mkdir(images_path);
	});

	m.downFrom(1, async() => {
		const dbH = db.getCreateDB();
		dbH.close();//just to be sure.

		const filename = getDBFile();
		await Deno.remove(filename);

		await Deno.remove(app.appspacePath('images'), {recursive:true});
	});

	m.upTo(2, async () => {
		const dbH = db.getCreateDB();
		upTo2(dbH);
		dbH.close();
	});

	m.downFrom(2, async() => {
		const dbH = db.getCreateDB();
		downFrom2(dbH);
		dbH.close();
	});

	return m.migrations;
}

// upTo1 separated out and exported to allow testing.
export function upTo1(db :DB) {

	db.query(`CREATE TABLE "items" (
		"item_id" INTEGER PRIMARY KEY ASC,
		"name" TEXT,
		"description" TEXT,
		"image" TEXT,
		"category_id" INTEGER,
		"check_stock" INTEGER,
		"deleted" DATETIME,
		"cur_status" TEXT
	)`);

	// Will need a bunch of indices probably
	//db.query(`CREATE INDEX active ON leftovers (spoil_date, finished)`);

	db.query(`CREATE TABLE "items_history" (
		"item_id" INTEGER,
		"proxy_id" TEXT,
		"datetime" DATETIME,
		"name" TEXT,
		"description" TEXT,
		"image" TEXT,
		"category_id" INTEGER,
		"check_stock" INTEGER,
		"deleted" DATETIME
	)`);
	// index on item_id, proxy_id, datetime

	db.query(`CREATE TABLE "items_status" (
		"item_id" INTEGER,
		"proxy_id" TEXT,
		"datetime" DATETIME,
		"status" TEXT
	)`);

	db.query(`CREATE TABLE "categories" (
		"category_id" INTEGER PRIMARY KEY ASC,
		"name" TEXT,
		"sort_order" INTEGER NOT NULL DEFAULT 9999
	)`);

	db.query(`CREATE TABLE "stores" (
		"store_id" INTEGER PRIMARY KEY ASC,
		"name" TEXT
	)`);

	db.query(`CREATE TABLE "item_store" (
		"item_id" INTEGER,
		"store_id" INTEGER
	)`);

	db.query(`CREATE TABLE "shop_list" (
		"list_id" INTEGER PRIMARY KEY ASC,
		"proxy_id" TEXT,
		"datetime" DATETIME
	)`);

	db.query(`CREATE TABLE "shop_list_items" (
		"list_id" INTEGER PRIMARY KEY ASC,
		"item_id" INTEGER,
		"proxy_id" TEXT,
		"datetime" DATETIME
	)`);
}

export function upTo2(db :DB) {
	db.query(`CREATE TABLE "store_categories" (
		"store_id" INTEGER,
		"category_id" INTEGER
	)`);
	db.query(`ALTER TABLE items ADD COLUMN generic BOOLEAN`);
	db.query(`ALTER TABLE items_history ADD COLUMN generic BOOLEAN`);
}

export function downFrom2(db :DB) {
	// A good downward migration function would take all the generic items
	// and make the cat stores the item stores.
	db.query(`DROP TABLE store_categories`);
	db.query(`ALTER TABLE items DROP COLUMN generic`);
	db.query(`ALTER TABLE items_history DROP COLUMN generic`);
}
