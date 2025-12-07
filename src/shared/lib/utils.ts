export const debounce = <Args extends unknown[]>(
	fn: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) => {
	let timerID: ReturnType<typeof setTimeout> | undefined
	return (...args: Args): void => {
		if (timerID) {
			clearTimeout(timerID)
		}
		timerID = setTimeout(() => fn(...args), delay)
	}
}