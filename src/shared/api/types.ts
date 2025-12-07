export class HttpError extends Error {
	statusCode: number
	constructor(statusCode: number) {
		super()
		this.name = 'HttpError'
		this.statusCode = statusCode
		this.message = `Произошла ошибка при попытке выполнения запроса. Запрос вернулся со статусом ${this.statusCode}.`
	}
}