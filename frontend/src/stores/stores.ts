import { ShallowRef, shallowRef } from 'vue';
import { defineStore } from 'pinia';

import { Store } from '../../../app/models/stores';

export const useStoresStore = defineStore('stores', () => {

	const stores :ShallowRef<Store[]> =
		shallowRef([{
			store_id: 1,
			name: "Trader Joe's"
		},{
			store_id: 2,
			name: "Sprouts"
		},{
			store_id: 3,
			name: "Walmart"
		}]);


	function getStore(store_id:number) :Store|undefined {
		return stores.value.find(s=> s.store_id === store_id)
	}

	return {getStore, stores}
});
