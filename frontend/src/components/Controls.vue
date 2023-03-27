<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();

const show = computed( () => {
	const r = route.name as string;
	return !!route.name && ['home', 'shop'].includes(r);
});

</script>

<template>
	<footer id="controls" v-if="show" class="fixed bottom-0 z-50 h-16 w-full px-2 md:px-6 bg-pink-500 text-white"></footer>
</template>