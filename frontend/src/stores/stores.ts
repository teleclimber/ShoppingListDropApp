import { ShallowRef, shallowRef, ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LoadState } from './common';
import { Store, StoreData } from '../../../app/app_types';

function storeFromRaw(raw:any) {
	return {
		store_id: Number(raw.store_id),
		name: raw.name + '',
		categories: raw.categories.map( (c:any) => Number(c) )
	};
}

export const useStoresStore = defineStore('stores', () => {
	const load_state = ref(LoadState.NotLoaded);
	const is_loaded = computed( () => load_state.value === LoadState.Loaded );

	const stores :ShallowRef<Map<number,ShallowRef<Store>>> = shallowRef(new Map);

	const sorted_stores = computed( () => {
		return Array.from(stores.value.values()).sort( (a,b) => a.value.name.localeCompare(b.value.name))
	});

	async function loadData() {
		if( load_state.value !== LoadState.NotLoaded ) return;
		load_state.value = LoadState.Loading;
		const resp = await fetch("/api/stores");
		const data = await resp.json() as Store[];
		if( !Array.isArray(data) ) throw new Error("expected an array");
		data.forEach( d => {
			const s = storeFromRaw(d);
			stores.value.set(s.store_id, shallowRef(s));
		});
		stores.value = new Map(stores.value);
		load_state.value = LoadState.Loaded;
	}

	async function addStore(store_data:StoreData) :Promise<number> {
		const resp = await fetch("/api/stores", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(store_data)
		});
		if( !resp.ok ) throw new Error("did not get OK");
		const data = await resp.json();
		const store_id = data.store_id;
		const store :Store = Object.assign({store_id}, store_data)
		stores.value.set(store_id, shallowRef(store));
		stores.value = new Map(stores.value);
		return store_id;
	}

	async function editStore(store_id: number, store_data:StoreData) :Promise<void> {
		const resp = await fetch("/api/stores/"+store_id, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(store_data)
		});
		if( !resp.ok ) throw new Error("did not get OK");
		const store :Store = Object.assign({store_id}, store_data)
		stores.value.set(store_id, shallowRef(store));
		stores.value = new Map(stores.value);
	}

	function getStore(store_id:number) :ShallowRef<Store>|undefined {
		return stores.value.get( store_id );
	}
	function mustGetStore(store_id:number) :ShallowRef<Store> {
		const s = getStore(store_id);
		if( !s ) throw new Error("expected a store");
		return s;
	}

	return { loadData, is_loaded, stores, sorted_stores, addStore, editStore, getStore, mustGetStore };
});
