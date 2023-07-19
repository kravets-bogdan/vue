<template>
  <div class="card">
    <div class="header">
      <h2>{{ city }}</h2>
      <div class="buttons">
        <button class="button-green" @click="addToFavorites()">
          {{ isFavorite ? "Удалить из избранного" : "Добавить в избранное" }}
        </button>
        <button
          class="button-green"
          @click="showDaysForecast = !showDaysForecast"
        >
          {{ showDaysForecast ? "Отобразить сегодня" : "Отобразить 6 дней" }}
        </button>
        <button class="button-green" @click="confirmDelete()" v-if="delete">
          Удалить
        </button>
      </div>
    </div>
    <div v-if="showDaysForecast">
      <ForecastChart :city="city" />
    </div>
    <div v-else>
      <div v-if="weatherData">
        <p v-if="weatherData.main">
          {{ `Temperature: ${roundTemperature(weatherData.main.temp)}°C` }}
        </p>
        <p v-if="weatherData.weather && weatherData.weather.length > 0">
          {{ `Description: ${weatherData.weather[0].description}` }}
        </p>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
  <Modal :is-open="isConfirmModalOpen" @close="cancelDelete">
    <p>Do you really want to remove the city {{ city }}?</p>
    <div class="modal-buttons">
      <button @click="deleteCity">Delete</button>
      <button @click="cancelDelete">Cancel</button>
    </div>
  </Modal>
  <Modal :is-open="favoriteModalOpen" @close="cancelDelete">
    Selected cities cannot be more than 5
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import ForecastChart from "./ForecastChart.vue";

export default {
  props: {
    city: {
      type: String,
      required: true,
    },
    delete: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["cityDeleted"],
  components: {
    Modal,
    ForecastChart,
  },
  data() {
    return {
      weatherData: [],
      isFavorite: false,
      isConfirmModalOpen: false,
      favoriteModalOpen: false,
      showDaysForecast: false,
    };
  },
  methods: {
    fetchWeatherData() {
      const apiKey = "36c415082cd1b09d49c15ce6dc314676";
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          this.weatherData = data;
          this.checkIsFavorite();
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    },

    roundTemperature(temperature) {
      const roundedValue = Math.round(temperature * 2) / 2;
      return roundedValue.toFixed(roundedValue % 1 === 0 ? 0 : 1);
    },

    confirmDelete() {
      this.isConfirmModalOpen = true;
    },

    cancelDelete() {
      this.isConfirmModalOpen = false;
      this.favoriteModalOpen = false;
    },

    deleteCity() {
      this.isConfirmModalOpen = false;
      this.$emit("cityDeleted", this.city);
    },

    addToFavorites() {
      const existingFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      if (!this.isFavorite) {
        if (existingFavorites.length < 5) {
          this.isFavorite = true;
          existingFavorites.push(this.city);
          localStorage.setItem("favorites", JSON.stringify(existingFavorites));
        } else {
          this.favoriteModalOpen = true;
        }
      } else {
        const index = existingFavorites.indexOf(this.city);
        if (index !== -1) {
          this.isFavorite = false;
          existingFavorites.splice(index, 1);
          localStorage.setItem("favorites", JSON.stringify(existingFavorites));
        }
      }
    },

    checkIsFavorite() {
      const favoriteList = JSON.parse(localStorage.getItem("favorites")) || [];
      this.isFavorite = favoriteList.includes(this.city);
    },
  },
  watch: {
    city: {
      immediate: true,
      handler() {
        this.fetchWeatherData();
      },
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/media";
.card {
  border: 1px solid black;
  position: relative;
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px;
}

.header {
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.button-green {
  border: 1px solid rgba(75, 192, 192, 1);
  color: rgba(75, 192, 192, 1);
  border-radius: 5px;
  margin-right: 5px;
  padding: 5px;

  &:last-child {
    margin-right: 0;
  }
}

.modal-buttons {
  justify-content: flex-end;
  margin-top: 10px;
  display: flex;
}

.modal-buttons button {
  border: 1px solid black;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 12px;
  padding: 3px;
}

@include media("<=tablet") {
  .buttons {
    flex-direction: column;
    align-items: flex-end;
    font-size: 12px;
    display: flex;
    padding: 3px;
  }

  .button-green {
    margin-bottom: 5px;
    margin-right: 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
