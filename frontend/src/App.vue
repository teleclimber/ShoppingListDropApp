<script setup lang="ts">


</script>

<template>
	<div class="bg-gray-50">
		<header class="sticky top-0 z-50 h-16 bg-green-600 text-white flex items-center justify-between">
			<div class="pl-6">
				<span class="text-2xl">
					<router-link to="/">Shop List</router-link>
				</span>
			</div>
			<div class="pr-6">
				<!-- <CurrentUser></CurrentUser> -->
			</div>
		</header>
		<main class="relative">
			<!-- <UpdateApp></UpdateApp> -->

			<div class=" md:p-6 ">
				<router-view/>
			</div>
		</main>
		<footer class="mt-72">
			<a target="_blank" href="https://icons8.com/icon/LLwOlK0zMIxj/grocery-shelf">Grocery Shelf</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
			<a target="_blank" href="https://icons8.com/icon/byZmliYnyFPz/fast-cart">Fast Cart</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
		</footer>
		<!-- <RequestErrorOverlay></RequestErrorOverlay> -->
		
	</div>
</template>


