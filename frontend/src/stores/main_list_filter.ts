import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

export const useMainListFilterStore = defineStore('main-list-filter', () => {
	const filters = ['all', 'check-stock', 'buy'];
	const f :Ref<string> = ref(filters[0]);

	read();

	function set(set_f: string) {
		if( !validate(set_f) ) throw new Error("can't set this filter, invalid value: "+set_f);
		f.value = set_f;
		write();
	}
	function get() :string {
		return f.value;
	}
	function read() {
		const stored_f = localStorage.getItem("main-list-filter");
		if( stored_f && validate(stored_f) ) f.value = stored_f;
	}
	function write() {
		localStorage.setItem("main-list-filter", f.value);
	}
	function validate(maybe_f :string) :boolean {
		return filters.includes(maybe_f);
	}

	return { get, set };
});

