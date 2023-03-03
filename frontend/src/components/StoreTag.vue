<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useStoresStore } from '../stores/stores';
const props = defineProps<{
	store_id: number,
}>();

const {getStore} = useStoresStore();

const store = computed( () => {
	return getStore( props.store_id );
});

const storeName = computed( () => {
	return store.value === undefined ? '??' : store.value.name;
})
const classes = computed( () => {
	if( store.value === undefined ) return ['bg-color-gray-50']
	return ['bg-color-orange-200']
})

</script>

<template>
	<span class="rounded-full px-2" :class="classes">{{ storeName }}</span>

</template>
