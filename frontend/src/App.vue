<script setup lang="ts">
import HeaderTitle from './components/HeaderTitle.vue';
import CurrentUser from './components/CurrentUser.vue';
import Controls from './components/Controls.vue';
import SelectStoreOverlay from './components/SelectStoreOverlay.vue';
import RequestErrorOverlay from './components/RequestErrorOverlay.vue';

</script>

<template>
	<div class="bg-gray-50 min-h-screen pb-20 box-content">
		<header class="sticky top-0 z-50 h-16 bg-pink-500 text-white flex items-center justify-between">
			<div class="pl-2 md:pl-6 text-2xl">
				<HeaderTitle></HeaderTitle>
			</div>
			<div class="pr-2 md:pr-6">
				<CurrentUser></CurrentUser>
			</div>
		</header>
		<Controls></Controls>
		<main class="relative">
			<!-- <UpdateApp></UpdateApp> -->
			<div class=" md:px-6 ">
				<router-view/>
			</div>
		</main>
	</div>
	<SelectStoreOverlay></SelectStoreOverlay>
	<RequestErrorOverlay class="z-50"></RequestErrorOverlay>
</template>


