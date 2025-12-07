import { ref, type MaybeRefOrGetter, toValue, watch, computed } from "vue"
import { API_KEY } from "@/shared/api"
import { type LocationCoord } from "@/entities/location"
import { type GetWeatherQueryParams } from './types.ts'
import { type CityWeather } from "@/entities/weather"
import { getWeather } from "../api/getWeather.ts"


export const useLoadWeather = (locations: MaybeRefOrGetter<LocationCoord[]>) => {

  const weather = ref<CityWeather[]>([])
  const isLoading = ref(false)

  const requests = computed(() => {
    const locs = toValue(locations)
    return locs.map(location => {
			const queryParams: GetWeatherQueryParams = {
				lat: String(location.lat),
				lon: String(location.lon),
				units: 'metric',
				appid: API_KEY,
			}
			return getWeather(queryParams)
    })
  })

  watch(requests, async (promises) => {
    isLoading.value = true
    weather.value = []
    try {
      const responses = await Promise.allSettled(promises)
      responses.forEach(response => {
        if (response.status === 'fulfilled' && response.value) {
          weather.value.push(response.value)
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  	}, { immediate: true, deep: true })

  return {
    weather,
    isLoading
  }
}
