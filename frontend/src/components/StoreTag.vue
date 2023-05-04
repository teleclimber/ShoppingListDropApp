<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useStoresStore } from '../stores/stores';
const props = defineProps<{
	store_id: number,
}>();

const {getStore} = useStoresStore();

const store = computed( () => {
	const s = getStore( props.store_id );
	if( s ) return s.value;
});

const storeName = computed( () => {
	return store.value === undefined ? '??' : store.value.name;
});
</script>

<template>
	<span v-if="store === undefined" class="bg-gray-50 text-gray-500">??</span>
	<span v-else
		class="rounded-md px-1 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis bg-green-100 text-green-800">{{ storeName }}</span>
</template>
