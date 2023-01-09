import {MigrationsBuilder} from 'https://deno.land/x/dropserver_app@v0.2.1/mod.ts';

import app from './app.ts';
import getDB, {getCreateDB, getDBFile} from './db.ts';

export default function createMigrations() {
	const m = new MigrationsBuilder;

	m.upTo(1, async () => {
		console.log("creating db");
		const db = getCreateDB();
	
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
			"category_id" INTEGER
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
			"name" TEXT
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
	
		db.close();
	
		// create a dir for the images:
		const images_path = app.appspacePath('images');
		await Deno.mkdir(images_path);
	});

	m.downFrom(1, async() => {
		const db = getDB();
		db.close();//just to be sure.

		const filename = getDBFile();
		await Deno.remove(filename);

		await Deno.remove(app.appspacePath('images'), {recursive:true});
	});

	return m.migrations;
}