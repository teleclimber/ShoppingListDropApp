<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useCategoriesStore } from '../stores/categories';

const categoriesStore = useCategoriesStore();
categoriesStore.loadData();

const sort_mode = ref(false);

const drag_container_elem :Ref<HTMLElement|undefined> = ref();

// Potential improvement: possibility to use transform only:
// - don't remove the dragged element from flow, just transform: translateY() on drag
// - don't have spacers, instead translateY the other list items up/down as needed.

const dragged_cat_id :Ref<number|undefined> = ref();
let dragged_elem :HTMLElement | undefined;
const start_index = ref(-1);
let start_client_y = 0;
let start_y = 0;
const spacer_h = ref(40);
let ladder: number[] = [];
const cur_drop_index = ref(-1);

function pointerDown(event:PointerEvent, category_id:number) {
	if( drag_container_elem.value === undefined ) return;

	ladder = [];
	let tot_h = 0;
	start_y = 0;
	let top_done = false;
	let i = 0;
	// @ts-ignore
	for (const child of drag_container_elem.value.children ) {
		let cat_id = Number(child.dataset.category_id);
		if( isNaN(cat_id) ) continue;
		
		if( cat_id !== category_id && !top_done ) start_y += child.offsetHeight;
		if( cat_id === category_id ) {
			cur_drop_index.value = i;
			start_index.value = i;
			dragged_elem = child;
			top_done = true;
		}
		ladder.push( tot_h + Math.round(child.offsetHeight/2) );
		tot_h += child.offsetHeight;
		i += 1;
	}

	// @ts-ignore
	if( event.target ) event.target.setPointerCapture(event.pointerId);
	else throw new Error("no event target");
	
	dragged_cat_id.value = category_id;

	start_client_y = event.clientY;

	if( !dragged_elem ) throw new Error("no dragged category elem");
	spacer_h.value = dragged_elem.offsetHeight;
	dragged_elem.style.transform = `translateY(${start_y}px)`;
}

function pointerUp(event:PointerEvent, category_id:number) {
	if( dragged_cat_id.value === undefined ) {
		cancelDrag();
		return;	
	}
	if( start_index.value === cur_drop_index.value ) {
		cancelDrag();
		return;
	}
	
	const ordered = categoriesStore.sorted_categories.map(  c=> c.value.category_id );
	ordered.splice(start_index.value, 1);
	ordered.splice(cur_drop_index.value, 0, dragged_cat_id.value);

	categoriesStore.setCategoryOrder(ordered);

	cancelDrag();
}

let raf_i :number = 0;
function pointerMove(event:PointerEvent, category_id:number) {
	event.preventDefault();
	event.stopPropagation();

	let cur_top = start_y + event.clientY - start_client_y;
	cur_top = Math.max(cur_top, -5);
	cur_top = Math.min(cur_top, ladder[ladder.length -1]);
	
	const index = ladder.findIndex( l => l >= cur_top );
	cur_drop_index.value = index < 0 ? ladder.length -1 : index;

	cancelAnimationFrame(raf_i);
	raf_i = requestAnimationFrame( () => {
		if( dragged_elem === undefined ) return;
		dragged_elem.style.transform = `translateY(${cur_top}px)`;
	});
}

function pointerCancel(event:PointerEvent) {
	cancelDrag();
}

// could also have lostpointercapture

function cancelDrag() {
	start_client_y = 0;
	start_index.value = -1;
	cur_drop_index.value = -1;
	if( dragged_elem ) {
		dragged_elem.style.top = 0+'';
		dragged_elem.style.transform = `translateY(0)`;
		dragged_elem = undefined;
	}
	dragged_cat_id.value = undefined;
}

function doneSorting() {
	// 
	sort_mode.value = false;
}

const static_class = ['relative'];
const drag_class = ['shadow-xl', 'z-10', 'absolute', 'top-0'];

</script>

<template>
	<template v-if="!sort_mode">
		<div v-for="category in categoriesStore.sorted_categories" :key="category.value.category_id" 
			class="p-2 border-b relative bg-white flex justify-between">
			<span class="font-bold">{{category.value.name}}</span>
			<router-link :to="{name:'edit-category', params:{category_id:category.value.category_id}}"
				class="px-3 uppercase text-sm border border-blue-600 text-blue-600">
				edit</router-link>
		</div>
	</template>
	<div ref="drag_container_elem" v-else class="relative">
		<template v-for="(category, index) in categoriesStore.sorted_categories" :key="category.value.category_id">
			<div v-if="dragged_cat_id !== undefined && index <= start_index " 
				class="transition-all ease-linear"
				:style="{height: index === cur_drop_index ? spacer_h+'px' : 0}"></div>
			<div 
				class="p-2 border-b bg-white flex justify-between w-full"
				:class="[category.value.category_id === dragged_cat_id ? drag_class : static_class]"
				:data-category_id="category.value.category_id"
				:id="'drag-cat-'+category.value.category_id">
				<span class="font-bold">{{category.value.name}}</span>
				<span 
					class="touch-none"
					@pointerdown="pointerDown($event, category.value.category_id)"
					@pointerup="pointerUp($event, category.value.category_id)"
					@pointercancel="pointerCancel($event)"
					@pointermove="pointerMove($event, category.value.category_id)">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</span>
			</div>
			<div v-if="dragged_cat_id !== undefined && index > start_index" 
				class="transition-all ease-linear"
				:style="{height: index === cur_drop_index ? spacer_h+'px' : 0}"></div>
		</template>
	</div>

	<div class="pt-4 flex justify-center" v-if="categoriesStore.categories.size > 1">
		<button v-if="!sort_mode" @click="sort_mode = true" class="border border-pink-500 px-4 py-1 uppercase text-center text-pink-500 flex justify-center self-center">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
			</svg>
			Re-order
		</button>
		<button v-else @click="doneSorting" class="border border-pink-500 px-4 py-1 uppercase text-center text-pink-500 flex justify-center self-center">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
			</svg>
			Done
		</button>
	</div>

	<div class="pt-48 italic text-gray-500 flex justify-center">
		<span v-if="!categoriesStore.is_loaded">Loading...</span>
		<span v-else-if="categoriesStore.categories.size === 0">No categories.</span>
	</div>

	<router-link v-if="!sort_mode" to="add-category" class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full fixed bottom-6 right-6">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
	</router-link>
</template>