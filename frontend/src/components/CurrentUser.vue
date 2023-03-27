<script lang="ts" setup>
import { computed } from "vue";

import { useCurrentUserStore } from "../stores/current_user";

const currentUserStore = useCurrentUserStore();
currentUserStore.loadData();
const user = computed( () => currentUserStore.user );

</script>

<template>
	<div class="flex items-center">
		<span class="hidden md:block px-2">{{ user ? user.display_name : "?" }}</span>
		<img v-if="user && user.avatar" :src="'/avatars/'+user.avatar" class="w-10 h-10 rounded-full border border-white">
		<div v-else class="w-10 h-10 bg-gray-100 rounded-full border border-white">U</div>
	</div>
</template>
