<script lang="ts" setup>import {computed} from 'vue';
import { useResponseGuardStore } from '../stores/response_guard';
const guardStore = useResponseGuardStore();
const show_overlay = computed( () => {
	return guardStore.errors.length !== 0 || guardStore.unauthorized
});
</script>

<template>
	<div v-if="show_overlay" class="fixed top-0 h-full w-full box-border bg-gray-500 bg-opacity-50 p-4 flex justify-center items-center">
		<div v-if="guardStore.errors.length !== 0" class="w-full sm:max-w-3xl rounded-md shadow-lg bg-red-100 px-4 sm:px-6 py-5">
			<h3 class="text-xl text-red-700">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
				Error Communicating With Server
			</h3>
			<section class="">
				<div class="my-2 border-l-4 border-red-800 bg-white" v-for="err in guardStore.errors">
					<div class="flex">
						<div class="flex-shrink-0 w-16 uppercase font-bold text-gray-600 text-center">{{err.method}}</div>
						<div class="flex-grow-0 font-mono">{{err.path}}</div>
					</div>
					<div class="flex items-center">
						<div class="flex-shrink-0 w-16 font-bold text-red-800 text-lg text-center">{{err.code}}</div>
						<div class="flex-grow-0">{{err.message}}</div>
					</div>
				</div>
			</section>
			<p class="italic text-red-700">Refresh the page before continuing.</p>
		</div>
		<div v-if="guardStore.unauthorized" class="w-full sm:max-w-3xl rounded-md shadow-lg bg-white px-4 sm:px-6 py-5">
			<h3 class="text-xl mb-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
				</svg>
				Logged Out
			</h3>
			<p>You may be logged out.</p>
			<p>Log in to your Dropserver account, and click on this appspace there.</p>
			<p>You may then try to reload this page.</p>
		</div>
	</div>
</template>
