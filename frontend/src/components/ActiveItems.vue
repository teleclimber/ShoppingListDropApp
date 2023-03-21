<script setup lang="ts">
	import { ShallowRef, Ref, ref, computed } from 'vue';
	import { useItemsStore } from '../stores/items';
	import { useCategoriesStore } from '../stores/categories';
	import { ItemPlus } from '../../../app/app_types';

	import ActiveItem from './ActiveItem.vue';

	const expanded_item :Ref<number|undefined> = ref();

	const itemsStore = useItemsStore();
	itemsStore.loadData();

	const categoriesStore = useCategoriesStore();

	const catItems = computed( () => {
		const ret :{name: string, items: ShallowRef<ItemPlus>[] }[] = [];
		categoriesStore.categories.forEach( c => {
			ret.push({
				name: c.name,
				items: itemsStore.ordered_items.filter( i => i.value.category_id === c.category_id )
			})
		});
		ret.push({
			name: "[No Category]",
			items: itemsStore.ordered_items.filter( i => i.value.category_id === -1 )
		});
		return ret;
	});

	// have to filter items by status, store, check_stock?

	// Also group items by category
	
	function toggleExpandItem(item_id:number) {
		if( item_id === expanded_item.value ) expanded_item.value = undefined;
		else expanded_item.value = item_id;
	}

</script>

<template>
	<div v-for="cItems in catItems">
		<h2 v-if="cItems.items.length !== 0" class="pl-2 mt-6 text-2xl font-medium text-center">{{ cItems.name }}</h2>
		<div class="">
			<ActiveItem 
				v-for="item in cItems.items"
				:item="item"
				:expanded="expanded_item === item.value.item_id"
				@toggle-expand="toggleExpandItem(item.value.item_id)"
			></ActiveItem>
		</div>
	</div>
</template>