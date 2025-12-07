import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { onMounted, } from 'vue'
import type { LocationCoord } from '@/entities/location'

export const useGetLocation = () => {
  const store = useStorage('weather-locations', [] as LocationCoord[])
  const isGettingLocation = ref(false) 
  const error = ref<string | null>(null)

  const getLocations = () => {
    if (store.value.length || !window.navigator.geolocation) {
      return 
    }

    isGettingLocation.value = true 
    error.value = null

    const onSuccess = (pos: GeolocationPosition) => {
      if (pos.coords.latitude && pos.coords.longitude) {
        store.value = [{
          lon: pos.coords.longitude,
          lat: pos.coords.latitude,
        }]
      }
      isGettingLocation.value = false
    }

    const onError = (err: GeolocationPositionError) => {
      console.warn(`Ошибка геолокации: ${err.message}`)
      error.value = err.message
      isGettingLocation.value = false 
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }

    window.navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  }

  const updateLocations = (locations: LocationCoord[]) => {
    store.value = locations
    error.value = null
  }

  onMounted(() => {
    getLocations()
  })

  return {
    store,
    isGettingLocation,
    error,
    updateLocations,
    getLocations,
  }
}



// import { useStorage } from '@vueuse/core'
// import { onBeforeMount } from 'vue'
// import { type LocationCoord } from '@/entities/location'

// export const useGetLocation = () => {

// 	const store = useStorage('weather-locations', [] as LocationCoord[])

// 	const getLocations = () => {
// 		if (!store.value.length && window.navigator.geolocation) {
// 			window.navigator.geolocation.getCurrentPosition(
// 				(pos) => {
// 					if (pos.coords.latitude && pos.coords.longitude) {
// 						store.value.push({ lon: pos.coords.longitude, lat: pos.coords.latitude, })
// 					}
// 				},
// 				(err) => {
// 					console.warn(`Ошибка: ${err.message}`);
// 				},
// 				{ enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
// 			);
// 		}
// 	}

// 	const updateLocations = (locations: LocationCoord[]) => {
// 		store.value = locations
// 	}

// 	onBeforeMount(() => {
// 		getLocations()
// 	})

// 	return {
// 		store,
// 		updateLocations
// 	}
// }
