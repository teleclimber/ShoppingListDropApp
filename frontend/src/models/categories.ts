import {Category} from '../../../app/models/categories';

const cats = [
	'Dairy',
	'Fruits & Veg',
	'Cereal',
	'Frozen foods',
	'Grains & Pasta',
	'Sauces & Condiments',
	'Alcohol',
	'Meds & Hygiene',
	'Clothing',
	'Bedding & Linens'
];

export function getAllCategories() :Category[] {
	return cats.map( (c, i) => {
		return {category_id:i, name:c}
	});
}