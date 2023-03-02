import { Store } from '../../../app/models/stores';

export function getStores() :Store[] {
	return [{
		store_id: 1,
		name: "Trader Joe's"
	},{
		store_id: 2,
		name: "Sprouts"
	},{
		store_id: 3,
		name: "Walmart"
	}]
}

export function getStore(store_id:number) :Store|undefined {
	return getStores().find(s=> s.store_id === store_id)
}