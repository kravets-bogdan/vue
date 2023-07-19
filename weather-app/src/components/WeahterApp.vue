<template>
  <AutoComplete @selectedCity="addCity" />
  <div v-if="errorMessage" class="error-message">
    <span> {{ errorMessage }}</span>
  </div>
  <div v-if="selectedCities.length">
    <div
      v-for="(city, index) in selectedCities"
      :key="index"
      class="favorite-city"
    >
      <WeatherCard @cityDeleted="deleteCity" :city="city.name" />
      <TemperatureChart :city="city.name" />
    </div>
  </div>
  <div v-else class="preloaders">
    <span>List is empty</span>
  </div>
</template>

<script>
import AutoComplete from "./AutoComplete.vue";
import WeatherCard from "./WeatherCard.vue";
import TemperatureChart from "./TemperatureChart.vue";

export default {
  components: {
    AutoComplete,
    TemperatureChart,
    WeatherCard,
  },

  data() {
    return {
      errorMessage: "",
      selectedCities: [],
      maxCitiesToShow: 5,
    };
  },

  methods: {
    addCity(selectedCity) {
      if (this.selectedCities.length >= this.maxCitiesToShow) {
        this.errorMessage =
          "Maximum number of cities - " + this.maxCitiesToShow + ".";
        return;
      }

      if (!selectedCity) {
        this.errorMessage = "No such city was found.";
        return;
      }

      if (this.selectedCities.some((city) => city.name === selectedCity.name)) {
        this.errorMessage = "This city has already been added.";
        return;
      }

      this.selectedCities.unshift(selectedCity);
      this.errorMessage = "";
    },

    deleteCity(cityName) {
      this.selectedCities = this.selectedCities.filter(
        (city) => city.name !== cityName
      );
      this.search = "";
    },
    getUserLocation() {
      fetch("https://ipinfo.io/json?token=3cea48c24f722d")
        .then((response) => response.json())
        .then((data) => {
          this.selectedCities.push({
            name: data.city,
          });
        })
        .catch((error) => {
          console.error("Error fetching user location:", error);
        });
    },
  },

  created() {
    this.getUserLocation();
  },
};
</script>

<style scoped lang="scss">
.favorite-cities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.temperature-chart {
  margin-top: 20px;
}

.error-message {
  border: 1px solid rgb(232, 112, 112);
  color: rgb(232, 112, 112);
  border-radius: 5px;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
}
</style>
