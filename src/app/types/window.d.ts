export {};

declare global {
  interface Window {
    initWeatherWidgets: () => void;
  }
}