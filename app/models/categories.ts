import {db} from '../db.ts';

export interface CategoryData {
	[key: string]: string|number|boolean|Date|null;
	name: string
}

export interface Category extends CategoryData {
	category_id: number,
}

const insertCategorySQL = `
INSERT INTO categories 
("name") VALUES
(:name)
`;
export function createCategory(data: CategoryData) :number {
	db.handle.query(insertCategorySQL, data);
	return db.handle.lastInsertRowId;
}

const updateCategorySQL = `
UPDATE categories SET
name=:name
WHERE category_id=:category_id
`;
export function editCategory(category_id: number, data:CategoryData) {
	db.handle.query(updateCategorySQL, Object.assign({category_id}, data));
}

//delete

export function getCategory(category_id: number) : Category {
	const rows = db.handle.queryEntries<Category>('SELECT * FROM categories WHERE category_id = :category_id', {category_id});
	if( rows.length !== 1 ) throw new Error("category not found: "+category_id);
	return rows[0];
}