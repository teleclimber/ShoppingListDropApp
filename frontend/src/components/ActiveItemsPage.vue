<script setup lang="ts">
import ActiveItems from './ActiveItems.vue';
</script>

<template>
	<ActiveItems></ActiveItems>
	<div class="pt-48 mx-2 md:mx6">
		<div class="grid grid-cols-2 gap-2">
			<router-link to="/categories" class="border border-pink-500 px-4 py-1 uppercase text-center text-pink-500">Categories</router-link>
			<router-link to="/stores" class="border border-pink-500 px-4 py-1 uppercase text-center text-pink-500">Stores</router-link>
		</div>
		<p class="mt-6 text-xs text-center">
			<a target="_blank" href="https://icons8.com/icon/byZmliYnyFPz/fast-cart">Fast Cart</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
		</p>
	</div>
</template>

  