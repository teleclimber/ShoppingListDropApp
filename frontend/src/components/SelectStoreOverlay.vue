<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStoresStore } from '../stores/stores';

const route = useRoute();

const show = computed( () => {
	return route.query.hasOwnProperty('select-store');
});

const storesStore = useStoresStore();
storesStore.loadData();

</script>

<template>
	<div v-if="show" class="fixed top-0 h-full w-full box-border  bg-gray-400/60 z-50 flex justify-center items-center">
		<div class="bg-white shadow-lg">
			<h4 class="py-2 px-4 font-medium">Pick store:</h4>
			<ul>
				<li v-for="s in storesStore.sorted_stores" :key="s.value.store_id">
					<router-link :to="{name: 'shop', params:{store_id:s.value.store_id}}" replace class="block py-2 px-4 border-t">{{ s.value.name }}</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>