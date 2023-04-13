import { ShallowRef, shallowRef, ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LoadState } from './common';
import { Category, CategoryData } from '../../../app/app_types';

// const cats = [
// 	'Dairy',
// 	'Fruits & Veg',
// 	'Cereal',
// 	'Frozen foods',
// 	'Grains & Pasta',
// 	'Sauces & Condiments',
// 	'Alcohol',
// 	'Meds & Hygiene',
// 	'Clothing',
// 	'Bedding & Linens'
// ];

function categoryFromRaw(raw:any) {
	return {
		category_id: Number(raw.category_id),
		name: raw.name + '',
		sort_order: Number(raw.sort_order)
	};
}

export const useCategoriesStore = defineStore('categories', () => {
	const load_state = ref(LoadState.NotLoaded);
	const is_loaded = computed( () => load_state.value === LoadState.Loaded );

	const categories :ShallowRef<Map<number,ShallowRef<Category>>> = shallowRef(new Map);

	const sorted_categories = computed( () => {
		return Array.from(categories.value.values()).sort( (a,b) => a.value.sort_order - b.value.sort_order );
	});

	async function loadData() {
		if( load_state.value !== LoadState.NotLoaded ) return;
		load_state.value = LoadState.Loading;
		const resp = await fetch("/api/categories");
		const data = await resp.json() as Category[];
		if( !Array.isArray(data) ) throw new Error("expected an array");
		data.forEach( d => {
			const s = categoryFromRaw(d);
			categories.value.set(s.category_id, shallowRef(s));
		});
		categories.value = new Map(categories.value);
		load_state.value = LoadState.Loaded;
	}

	async function addCategory(category_data:CategoryData) :Promise<number> {
		// For now set the sort order to be the last item (assumes existing items are sort_order are correct)
		category_data.sort_order = categories.value.size;
		const resp = await fetch("/api/categories", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(category_data)
		});
		if( !resp.ok ) throw new Error("did not get OK");
		const data = await resp.json();
		const category_id = data.category_id;
		const category :Category = Object.assign({category_id}, category_data)
		categories.value.set(category_id, shallowRef(category));
		categories.value = new Map(categories.value);
		return category_id;
	}

	async function editCategory(category_id: number, category_data:CategoryData) :Promise<void> {
		const resp = await fetch("/api/categories/"+category_id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(category_data)
		});
		if( !resp.ok ) throw new Error("did not get OK");
		const category :Category = Object.assign({category_id}, category_data)
		categories.value.set(category_id, shallowRef(category));
		categories.value = new Map(categories.value);
	}

	async function setCategoryOrder( ordered: number[] ) {
		console.log("ordered", ordered);
		ordered.forEach( (o, i) => {
			const c = mustGetCategory(o);
			c.value = Object.assign({}, c.value, {sort_order: i});
		});
		categories.value = new Map(categories.value);

		const resp = await fetch("/api/categories/", {
			method: "PATCH",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(ordered)
		});
		if( !resp.ok ) throw new Error("did not get OK");
	}

	function getCategory(category_id:number) :ShallowRef<Category>|undefined {
		return categories.value.get(category_id);
	}
	function mustGetCategory(category_id:number) :ShallowRef<Category> {
		const s = getCategory(category_id);
		if( !s ) throw new Error("expected a category");
		return s;
	}

	return { loadData, is_loaded, categories, sorted_categories, addCategory, editCategory, getCategory, mustGetCategory, setCategoryOrder };
});
