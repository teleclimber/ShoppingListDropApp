<script setup lang="ts">
import { ref, Ref, watch, onMounted } from "vue";

defineProps<{
	inline_add_mode: boolean
}>();

const emit = defineEmits<{
	(e: 'update:search', value: string ): void,
	(e: 'add-clicked', value: boolean): void,
	(e: 'close'): void
}>();
defineExpose({
	selectAndFocus
});

onMounted( () => {
	selectAndFocus();
});

const search_box_input :Ref<HTMLInputElement|undefined> = ref();
//const inline_add_mode = ref(false);

function selectAndFocus() {
	if( search_box_input.value ) {
		search_box_input.value.select();
		search_box_input.value.focus();
	}
}

const search = ref("");
function searchInput(e:Event) {
	// @ts-ignore
	if( e.target ) e.target.composing = false;
	// See: https://github.com/vuejs/vue/pull/9814#issuecomment-763266927
	// The issue is input events don't fire unless you set this.
}
watch( search, (s) => {
	emit('update:search', s.trim());
});

function addClicked() {
	emit('add-clicked', true);
}
function xClicked() {
	if( search.value.trim() === '' ) emit("close");
	else {
		search.value = '';
		selectAndFocus();
	}
}

</script>

<template>
	<div class="py-4 h-full flex justify-between items-stretch">
		<button @click.stop.prevent="xClicked" 
			class="mr-2 text-white flex items-center">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</button>
		<input 
			id="title"
			type="text"
			v-model="search"
			@input="searchInput"
			ref="search_box_input"
			class="w-full px-2 shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
		<button @click.stop.prevent="addClicked" 
			class="ml-2 px-3 border border-white text-white disabled:border-pink-300 disabled:text-pink-300 flex items-center whitespace-nowrap "
			:disabled="search.trim().length === 0">
				{{ inline_add_mode ? 'Full Add' : 'Quick Add' }}
			</button>
	</div>
</template>
