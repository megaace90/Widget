<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { type LocationCoord } from '@/entities/location';
import { type CityWeather } from '@/entities/weather'
import { type SortableEvent } from 'sortablejs'
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { onClickOutside } from '@vueuse/core';
import { debounce } from '@/shared/lib';
import { findCityByText } from '@/features/findCityByText';
import closeIcon from '@/shared/assets/icons/cross.svg'
import burgerIcon from '@/shared/assets/icons/burger.svg'
import trashIcon from '@/shared/assets/icons/trash.svg'
import submitIcon from '@/shared/assets/icons/submit.svg'

const emit = defineEmits<{
	(e: 'updateLocations', locations: LocationCoord[]): void,
	(e: 'closeSettings'): void,
}>()

const props = withDefaults(defineProps<{
  weather?: CityWeather[]
}>(), {
  weather: () => [] as CityWeather[]
})

const myLocations = ref<Required<LocationCoord>[]>(props.weather.reduce((acc: Required<LocationCoord>[], item: CityWeather) => {
	return acc = [...acc, { lon: item.coord.lon, lat: item.coord.lat, id: item.id, name: item.name, country: item.sys.country }]
}, []))

const searchQuery = ref('')
const searchedCities = ref<Required<LocationCoord>[]>([])
const searchForm = useTemplateRef<HTMLElement | null>('searchForm')
const listEl = useTemplateRef<HTMLElement | null>('listEl')

const debouncedSearch = debounce(async (query: string) => {
	try {
		if (query.trim() && query.trim().length >= 2) {
			searchedCities.value = await findCityByText(query)
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error)
		}
	}
}, 500)

const selectCity = (city: Required<LocationCoord>) => {
	myLocations.value.push( { lon: city.lon, lat: city.lat, id: city.id, name: city.name, country: city.country } )
	searchedCities.value = []
}

const deleteCity = (id: number) => {
	myLocations.value = myLocations.value.filter(item => item.id !== id)
}

const closeSettings = () => {
	emit('closeSettings')
}

useSortable(listEl, props.weather, {
  onUpdate: (e: SortableEvent) => {
    if (typeof e.oldIndex === 'number' && typeof e.newIndex === 'number') {
			moveArrayElement(myLocations, e.oldIndex, e.newIndex, e)
		}
  }
})

onClickOutside(searchForm, () => {
	searchedCities.value = []
})

watch(myLocations, () => {
	emit('updateLocations', myLocations.value)
}, {
	deep: true,
})
</script>

<template>
	<div class="settings">
		<div class="settings__header">
			<p>Settings</p>
			<button class="settings__action-button" @click="closeSettings" type="button" aria-label="Close settings">
				<div v-html="closeIcon" class="widget__icon"></div>
			</button>
		</div>
		<div class="settings__list" ref="listEl" v-if="myLocations.length">
			<div class="settings__item" v-for="city in myLocations" :key="city.id">
				<button class="settings__action-button settings__action-button--grab" type="button" aria-label="Reorder cities">
					<div v-html="burgerIcon" class="widget__icon"></div>
				</button>
				<p class="settings__text">
					<span>{{ city.name }}</span>, <span>{{ city.country }}</span>
				</p>
				<button 
					class="settings__action-button" 
					@click="deleteCity(city.id)" 
					type="button" 
					aria-label="Delete city">
					<div v-html="trashIcon" class="widget__icon"></div>
				</button>
			</div>
		</div>

		<div class="settings__add-city" ref="searchForm">
			<p>Add location</p>
			<form action="">
				<input 
					v-model="searchQuery" 
					@input="debouncedSearch(searchQuery)"
					type="text" 
					name="" 
					placeholder="New York"
					>
				<button class="settings__action-button" type="submit" aria-label="Add city">
					<div v-html="submitIcon" class="widget__icon"></div>
				</button>
			</form>
			<ul class="settings__sershed-cities" v-if="searchedCities.length">
				<li 
					v-for="city in searchedCities" 
					:key="city.id"
					@click="selectCity(city)"
				>
					{{ city.name }}, {{ city.country }}
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss">

.settings {

	* {
		padding: 0;
		margin: 0;
	}

	&__header {
		display: grid;
		grid-template: auto / 1fr auto;
		margin-bottom: 24px;
		p {
			font-size: 1.2rem;
			font-weight: 600;
		}
	}
	&__action-button {
		background: transparent;
		line-height: 0;
		cursor: pointer;
		&--grab {
			cursor: grab;
		}
	}
	&__list {
		margin-bottom: 48px;
	}
	&__item {
		display: grid;
		grid-template: auto / min-content 1fr min-content;
		align-items: center;
		column-gap: 8px;
		padding: 8px;
		border-radius: 8px;
		background-color: rgb(230, 230, 230);
		&:not(:last-child) {
			margin-bottom: 24px;
		}
	}
	&__add-city {
		& > p {
			font-weight: 600;
			margin-bottom: 16px;
		}
		form {
			display: flex;
			flex-wrap: wrap;
			input {
				padding: 8px;
				flex: 1;
  			min-width: 100px;
				border-radius: 8px;
			}
			button {
				padding: 8px;
			}
		}
	}

	&__sershed-cities {
		list-style-type: none;
		& > li {
			cursor: pointer
		}
	}
}
</style>