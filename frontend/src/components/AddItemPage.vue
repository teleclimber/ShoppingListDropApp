<script setup lang="ts">
import { Ref } from 'vue';
import { useRouter } from 'vue-router';
import AddEditItem from './AddEditItem.vue';

const props = defineProps<{
	name: string|undefined,
}>();

	// read from query params to know what to pre-set.
	//router.currentRoute.value.p

</script>


<template>
	<AddEditItem mode="add" :start_name="name"></AddEditItem>
</template>