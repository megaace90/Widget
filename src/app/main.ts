import { createApp } from 'vue';
import WeatherApp from './WeatherApp.vue';

window.initWeatherWidgets = function() {
  document.querySelectorAll('weather-widget').forEach(el => {
    createApp(WeatherApp).mount(el);
  });
};

window.onload = () => window.initWeatherWidgets();