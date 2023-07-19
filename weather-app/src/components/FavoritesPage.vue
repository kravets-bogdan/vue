<template>
  <div
    v-if="favoriteCities.length"
    v-for="city in favoriteCities"
    :key="city.id"
  >
    <WeatherCard
      @cityDeleted="deleteCity"
      :city="city"
      :delete="false"
      :key="`weather_${city.id}`"
    />
    <TemperatureChart :city="city" :key="`temperature_${city.id}`" />
  </div>
  <div v-else class="preloaders">
    <span>Favorite list is empty</span>
  </div>
</template>

<script>
import TemperatureChart from "./TemperatureChart.vue";
import WeatherCard from "./WeatherCard.vue";

export default {
  components: {
    WeatherCard,
    TemperatureChart,
  },
  data() {
    return {
      favoriteCities: [],
      isFavoritePage: true,
    };
  },
  methods: {
    deleteCity(cityName) {
      const index = this.favoriteCities.findIndex(
        (city) => city.name === cityName
      );
      if (index !== -1) {
        this.favoriteCities.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(this.favoriteCities));
      }
    },
    loadFavoritesFromLocalStorage() {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      this.favoriteCities = favorites;
    },
  },
  created() {
    this.loadFavoritesFromLocalStorage();
  },
};
</script>
