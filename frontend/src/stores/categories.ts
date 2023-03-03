import { shallowRef } from 'vue';
import { defineStore } from 'pinia';

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

export const useCategoriesStore = defineStore('categories', () => {

	const categories = shallowRef( (() => {
		return cats.map( (c, i) => {
			return {category_id:i, name:c};
		});
	})());

	return {categories}
});


