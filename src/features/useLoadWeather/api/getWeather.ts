import { BASE_URL, WEATHER_URL } from "@/shared/api"
import { HttpError } from "@/shared/api"
import { type GetWeatherQueryParams } from '../model/types.ts'

export const getWeather = async (queryParams: GetWeatherQueryParams) => {
	try {
		const url = new URL(WEATHER_URL, BASE_URL)
		for (let [param, value] of Object.entries(queryParams)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(param, String(value))
			}
		}
		const res = await fetch(url)
		if (!res.ok) {
			throw new HttpError(res.status)
		}
		return await res.json()
	} catch (error: unknown) {
		if (error instanceof HttpError) {
			console.error(error)
		} else {
			throw error
		}
	}
}