<script setup lang="ts">
import { ref } from 'vue';
import type { LocationCoord } from '@/entities/location';
import { CityWeatherCard } from '@/entities/weather';
import { useGetLocation } from '@/features/useGetLocation';
import { useLoadWeather } from '@/features/useLoadWeather';
import WidgetSettings from './WidgetSettings.vue';
import settinsIcon from '@/shared/assets/icons/settings.svg'

const isSettingsOpened = ref(false)
const { store, updateLocations } = useGetLocation()
const { weather } = useLoadWeather(store)

const openSettings = () => {
	isSettingsOpened.value = true
}

const closeSettings = () => {
	isSettingsOpened.value = false
}

let timeoutId: ReturnType<typeof setTimeout> | null = null
const updateLoc = (locations: LocationCoord[]) => {
	if (timeoutId) clearTimeout(timeoutId)
	timeoutId = setTimeout(() => {
		updateLocations(locations)
	}, 1500)
}
</script>
<template>
	<div class="widget">
		<div class="widget__container">
			<widget-settings 
				v-if="isSettingsOpened" 
				:weather="weather" 
				@close-settings="closeSettings"
				@update-locations="updateLoc"
				class="widget__settings"
				/>
			<div v-else class="widget__inner">
				<button @click="openSettings" class="widget__settings-button" type="button" aria-label="Перейти в настройки">
					 <div v-html="settinsIcon" class="widget__icon"></div>
				</button>
				<div class="widget__locations" v-if="store.length">
					<city-weather-card class="widget__location-card" v-for="cityWeather in weather" :city-weather="cityWeather" />
				</div>
				<div class="widget__geolocation-failed" v-else>Failed to retrieve location data. Specify the location manually in the settings</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.widget {
	container-type: inline-size;
	width: 100%;

	font-family: IBM Plex Sans;
	font-size: 1rem;

	button {
		border: none;
	}
	button > img {
		pointer-events: none;
	}
	&__container {
		max-width: 90%;
		margin-inline: auto;
		margin-block: 20px;
		padding: 16px;
		min-height: 360px;
		background: lightblue;
		border-radius: 16px;
		
		@container (min-width: 600px) {
			max-width: 320px;
		}
	}
	&__inner {
		position: relative;
	}
	&__settings-button {
		position: absolute;
		top: 0;
		right: 0;
		background: transparent;
		cursor: pointer;
		line-height: 0;
		padding: 0;
	}
	&__geolocation-failed {
		max-width: 84%;
	}
	&__locations {
		display: grid;
		grid-auto-flow: row;
		justify-content: center;
		row-gap: 60px;
	}
	&__icon {
		display: inline-block;
		width: 24px;
		height: 24px;
		vertical-align: middle;
		> svg {
			width: 100%;
			height: 100%;
		}
	}
}
</style>