import { WIND_DIRECTION, BEAFORT_SCALE } from "./constants.ts";

export const transformWindDegToDirection = (deg: number): string => {
  const index = Math.round(deg / 45) % 8;
	if (!deg || !WIND_DIRECTION[index]) {
		return WIND_DIRECTION[0]!;
	}
  return WIND_DIRECTION[index];
}

export const transformWindSpeedToBeaufort = (speed: number): string => {
  for (const level of BEAFORT_SCALE) {
    if (speed <= level.max) {
      return level.description;
    }
  }
  return '';
}