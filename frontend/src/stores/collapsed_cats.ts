import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

export const useCollapsedCategoriesStore = defineStore('collapsed-categories', () => {
	const cc :Ref<Set<number>> = ref(new Set);

	read();

	function toggle(cat_id:number) {
		if( cc.value.has(cat_id) ) cc.value.delete(cat_id);
		else cc.value.add(cat_id);
		write();
	}
	function collapse(cat_ids:number[]) {
		cat_ids.forEach( c => cc.value.add(c) );
		write();
	}

	function read() {
		const s = localStorage.getItem("collapsed-categories");
		cc.value = new Set;
		if( s ) {
			cc.value = new Set(s.split(',').map( str => Number(str)))
		}
	}
	function write() {
		localStorage.setItem("collapsed-categories", Array.from(cc.value).join(','));
	}

	return { cc, toggle, collapse };
});