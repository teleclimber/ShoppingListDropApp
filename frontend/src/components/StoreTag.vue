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
})
const classes = computed( () => {
	if( store.value === undefined ) return ['bg-gray-50']
	return ['bg-purple-100']
})

</script>

<template>
	<span class="rounded-md px-1 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis" :class="classes">{{ storeName }}</span>

</template>
