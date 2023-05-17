import { ShallowRef, shallowRef, ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LoadState } from './common';
import { User } from '../../../app/app_types';
import { gFetch } from './response_guard';

// this is not finished and is unused and may not be functional

function userFomRaw(raw:any) :User {
	return {
		proxy_id: raw.proxyId+'',
		//permissions: raw.permissions,
		display_name: raw.displayName+'',
		avatar: raw.avatar+''
	};
}

export const useUsersStore = defineStore('users', () => {
	const load_state = ref(LoadState.NotLoaded);
	const is_loaded = computed( () => load_state.value === LoadState.Loaded );

	const users :ShallowRef<Map<string,User>> = shallowRef(new Map);

	async function loadData() {
		if( load_state.value !== LoadState.NotLoaded ) return;
		load_state.value = LoadState.Loading;
		const resp = await gFetch("/api/users");
		const data = await resp.json();
		if( !Array.isArray(data) ) throw new Error("expected data to be array");
		const m:Map<string,User> = new Map;
		data.forEach( d => {
			const u = userFomRaw(d);
			m.set(u.proxy_id, u);
		});
		users.value = m;
		load_state.value = LoadState.Loaded;
	}

	return { is_loaded, loadData };
});