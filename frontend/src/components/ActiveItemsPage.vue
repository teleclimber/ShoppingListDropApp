<script setup lang="ts">
	import ActiveItems from './ActiveItems.vue';
	import QuickAdd from './QuickAdd.vue';
	
</script>


<template>
	<QuickAdd class="mt-2 mx-2 md:mx-0"></QuickAdd>
	<ActiveItems></ActiveItems>
	<div class="pt-48 mx-2 md:mx6">
		<div class="grid grid-cols-2">
			..
			<router-link to="/stores" class="border border-pink-500 px-4 py-1 uppercase text-center text-pink-500">Stores</router-link>
		</div>
		<p class="mt-6 text-xs text-center">
			<a target="_blank" href="https://icons8.com/icon/byZmliYnyFPz/fast-cart">Fast Cart</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
		</p>
	</div>
</template>

  