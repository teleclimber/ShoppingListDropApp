<script setup lang="ts">


</script>

<template>
	<div>
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

			<router-view/>
		</main>
		<footer></footer>
		<!-- <RequestErrorOverlay></RequestErrorOverlay> -->
		
	</div>
</template>


