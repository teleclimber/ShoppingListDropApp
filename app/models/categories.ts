import {db} from '../db.ts';
import type { Category, CategoryData } from '../app_types.ts';

const insertCategorySQL = `
INSERT INTO categories 
("name", "sort_order") VALUES
(:name, :sort_order)
`;
export function createCategory(data: CategoryData) :number {
	db.handle.query(insertCategorySQL, data);
	return db.handle.lastInsertRowId;
}

const updateCategorySQL = `
UPDATE categories SET
name=:name, sort_order=:sort_order
WHERE category_id=:category_id
`;
export function editCategory(category_id: number, data:CategoryData) {
	db.handle.query(updateCategorySQL, Object.assign({category_id}, data));
}

const updateCategorySortSQL = `
UPDATE categories SET
sort_order=:sort_order
WHERE category_id=:category_id
`;
export function editCategoriesOrder(sorted:number[]) {
	db.handle.transaction( () => {
		sorted.forEach( (category_id, sort_order) => {
			db.handle.query(updateCategorySortSQL, {category_id, sort_order});
		});
	});
}


//delete

// unnecessary?
export function getCategory(category_id: number) : Category {
	const rows = db.handle.queryEntries<Category>('SELECT * FROM categories WHERE category_id = :category_id', {category_id});
	if( rows.length !== 1 ) throw new Error("category not found: "+category_id);
	return rows[0];
}

export function getCategories() :Category[] {
	const rows = db.handle.queryEntries<Category>('SELECT * FROM categories');
	return rows;
}