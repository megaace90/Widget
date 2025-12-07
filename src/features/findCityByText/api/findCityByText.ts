import { BASE_URL, GEOCODING_URL, API_KEY } from "@/shared/api"
import { HttpError } from "@/shared/api"

export const findCityByText = async (query: string) => {
	try {
		if (query && query.length < 2) return
		const res = await fetch(`${BASE_URL}${GEOCODING_URL}?q=${query}&limit=10&appid=${API_KEY}`)
		if (!res.ok) {
			throw new HttpError(res.status)
		}
		return await res.json()
	} catch(error: unknown) {
		if (error instanceof HttpError) {
			console.error(error)
		} else {
			throw error
		}
	}
}