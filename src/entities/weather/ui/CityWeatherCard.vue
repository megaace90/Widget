<script setup lang="ts">
import { computed } from 'vue'
import { type CityWeather } from '../model/types';
import { transformWindDegToDirection, transformWindSpeedToBeaufort } from '../lib/utils';
import windIcon from '@/shared/assets/icons/wind-direction.svg'
import pressureIcon from '@/shared/assets/icons/pressure.svg'

const { cityWeather } = defineProps<{
	cityWeather: CityWeather
}>()

const description = computed(() => {
	if (!cityWeather || !cityWeather.weather.length) {
		return ''
	}
	return cityWeather.weather.reduce((acc: string, current: Record<string, string | number>) => {
		return acc += String(current.description).charAt(0).toUpperCase() + String(current.description).slice(1) + '.' + ' '
	}, '')
})

const mainIconUrl = computed(() => {
	if (!cityWeather || !cityWeather.weather.length) {
		return ''
	}
	return ` https://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`
})

const windDirRotate = computed(() => {
	if (!cityWeather || !cityWeather.wind.deg) {
		return '-45deg'
	}
	return -45 + cityWeather.wind.deg + 'deg'
})
</script>

<template>
	<article class="location-card" v-if="cityWeather">
		<p class="location-card__location">
			<span class="location-card__city">{{ cityWeather.name }}</span>, 
			<span class="location-card__country-code">{{ cityWeather.sys.country }}</span>
		</p>
		<div class="location-card__main-info">
			<div class="location-card__icon">
				<img width="144" height="144" :src="mainIconUrl" alt="">
			</div>
			<div class="location-card__temp">{{ Math.round(cityWeather.main.temp) }}°C</div>
		</div>
		<div class="location-card__other">
			<p class="location-card__description">
				Feels like {{ cityWeather.main.feels_like }}°C. {{ description }} {{ transformWindSpeedToBeaufort(cityWeather.wind.speed) }}
			</p>
			<p class="location-card__wind">
				<span v-html="windIcon" class="location-card__wind-icon" :style="`transform: rotate(${windDirRotate}); transform-origin: 50% 50%`"></span>
				<span class="location-card__wind-speed">{{ cityWeather.wind.speed }}m/s </span>
				<span class="location-card__wind-direction">{{ transformWindDegToDirection(cityWeather.wind.deg) }}</span>
			</p>
			<p class="location-card__pressure">
				<span v-html="pressureIcon" class="location-card__pressure-icon"></span>
				<span class="location-card__pressure-value">{{ cityWeather.main.pressure }}hPa</span>
			</p>
			<p class="location-card__humidity">
				<span class="location-card__humidity-icon">Humidity: </span>
				<span class="location-card__humidity-value">{{ cityWeather.main.humidity }}%</span>
			</p>
			<p class="location-card__dew-point">
				<span class="location-card__dew-point-icon">Dew-point: </span>
				<span class="location-card__dew-point-value">0°C</span>
			</p>
			<p class="location-card__visibility">
				<span class="location-card__visibility-icon">Visibility </span>
				<span class="location-card__visibility-value">{{ cityWeather.visibility }}km</span>
			</p>
		</div>
	</article>
</template>

<style lang="scss">
.location-card {

	* {
		padding: 0;
		margin: 0;
	}

	&__location {
		font-size: 1.2rem;
		font-weight: 600;
	}
	&__main-info {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	&__temp {
		font-size: 3rem;
		font-weight: 600;
	}
	&__other {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px 4px;
		align-items: baseline;
	}
	&__description {
		grid-column: span 2;
	}
	&__wind,
	&__pressure {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: min-content max-content;
		grid-auto-columns: 1fr;
		column-gap: 4px;
		align-items: center;

		&-icon {
		display: inline-block;
		vertical-align: middle;
		width: 14px;
		height: 14px;
		> svg {
			width: 100%;
			height: 100%;
		}
	}
	}
}
</style>