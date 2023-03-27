import { ShallowRef, shallowRef, ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LoadState } from './common';
import { User } from '../../../app/app_types';

function userFromRaw(raw:any) :User {
	return {
		proxy_id: raw.proxyId+'',
		//permissions: raw.permissions,
		display_name: raw.displayName+'',
		avatar: raw.avatar+''
	};
}

export const useCurrentUserStore = defineStore('current-user', () => {
	const load_state = ref(LoadState.NotLoaded);
	const is_loaded = computed( () => load_state.value === LoadState.Loaded );

	const user :ShallowRef<User|undefined> = shallowRef();

	async function loadData() {
		if( load_state.value !== LoadState.NotLoaded ) return;
		load_state.value = LoadState.Loading;
		const resp = await fetch("/api/current-user");
		const data = await resp.json();
		user.value = userFromRaw(data);
		load_state.value = LoadState.Loaded;
	}

	return { is_loaded, loadData, user };
});