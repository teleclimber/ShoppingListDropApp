<script setup lang="ts">
import { Ref, ref, onMounted, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

import { useStoresStore } from '../stores/stores';

const props = defineProps<{
	store_id?: number
}>();

const router = useRouter();

const storesStore = useStoresStore();
storesStore.loadData();//? Why?

const name_input :Ref<HTMLInputElement|undefined> = ref();
const name = ref("");

onMounted( () => {
	if( name_input.value ) name_input.value.focus();
});

watchEffect( () => {
	if( props.store_id === undefined ) return;
	if( !storesStore.is_loaded ) return;
	const store = storesStore.mustGetStore(props.store_id);
	name.value = store.value.name;
});

const valid = computed( () => {
	const n = name.value.trim();
	if( n === '' || n.length > 50 ) return false;
	return true;
});

async function submitClicked() {
	if( !valid.value ) return;

	if( props.store_id === undefined ) {
		await storesStore.addStore({name:name.value});
	}
	else {
		await storesStore.editStore( props.store_id, {name:name.value});
	}

	router.back();
}

function cancel() {
	router.back();
}

</script>

<template>
	<div class="p-2">
		<form @submit.prevent="submitClicked" @keyup.esc="cancel">
			<div class="my-4">
				<label for="name" class="block text-sm font-medium text-gray-700">
					Store name:
				</label>
				<div class="mt-1">
					<input id="name" type="text" v-model="name" ref="name_input" class="w-full shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
				</div>
			</div>
			<div class="mt-6 flex justify-between">
				<input type="button" class="px-4 py-2 uppercase font-bold text-blue-600 border border-blue-600" @click="cancel" value="Cancel" />
				<input
					type="submit"
					class="px-4 py-2 uppercase font-bold" 
					:class="[valid ? ['text-blue-600 border','border-blue-600']:['text-gray-400 border','border-gray-400'] ]"
					:disabled="!valid"
					value="Save" />
			</div>
		</form>
	</div>
</template>