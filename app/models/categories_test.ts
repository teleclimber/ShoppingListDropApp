import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";
import '../../ds_test/index.ts';
import {db} from '../db.ts';
import {createCategory, getCategory} from './categories.ts';
import type { Category, CategoryData } from '../app_types.ts';
import {upTo1} from '../migrations.ts';


Deno.test({
	name:"Create cateogry then get",
	fn: () => {
		const handle = new DB();
		upTo1(handle);

		db.setHandle(handle);

		const category_data:CategoryData = {
			name: "cat1",
			sort_order: 77
		};
		const category_id = createCategory(category_data);

		const db_cat = getCategory(category_id);
		const expected_cat = Object.assign({category_id}, category_data);
		assertEquals(db_cat, expected_cat);

	}
});

// create then upate then get...