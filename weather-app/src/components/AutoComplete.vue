<template>
  <div class="content">
    <input v-model="searchText" @input="filterCitiesBySearch" />
    <button @click="addWeatherBlock">+</button>
  </div>
  <ul v-show="shouldShowResults" ref="cityList">
    <li v-for="city in visibleCities" :key="city.id" @click="selectCity(city)">
      {{ city.name }}
    </li>
  </ul>
</template>

<script>
import TemperatureChart from "./TemperatureChart.vue";
import cityList from "../assets/city.list.json";
import WeatherCard from "./WeatherCard.vue";
import Modal from "./Modal.vue";

export default {
  emits: ["selectedCity"],
  components: {
    WeatherCard,
    TemperatureChart,
    Modal,
  },
  data() {
    return {
      searchText: "",
      cities: cityList,
      filteredCities: [],
      visibleCities: [],
      itemsPerPage: 100,
      currentPage: 0,
    };
  },

  watch: {
    searchText: "filterCitiesBySearch",
  },

  mounted() {
    this.updateVisibleCities();
    this.$refs.cityList.addEventListener("scroll", this.loadMoreCities);
  },

  beforeDestroy() {
    this.$refs.cityList.removeEventListener("scroll", this.loadMoreCities);
  },

  computed: {
    shouldShowResults() {
      return this.searchText.trim() !== "" && this.filteredCities.length > 0;
    },
  },

  methods: {
    filterCitiesBySearch() {
      this.filteredCities = this.cities.filter((city) =>
        city.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.updateVisibleCities();
      this.scrollToTop();
    },

    updateVisibleCities() {
      this.currentPage = 0;
      this.visibleCities = this.filteredCities.slice(
        0,
        (this.currentPage + 1) * this.itemsPerPage
      );
    },

    selectCity(city) {
      this.searchText = city.name;
      this.$emit("selectedCity", city);
    },

    addWeatherBlock() {
      const selectedCity = this.filteredCities.find(
        (city) => city.name.toLowerCase() === this.searchText.toLowerCase()
      );
      this.$emit("selectedCity", selectedCity);
      this.searchText = "";
      this.visibleCities = [];
    },

    scrollToTop() {
      if (this.$refs.cityList) {
        this.$refs.cityList.scrollTop = 0;
      }
    },

    loadMoreCities() {
      const scrollPosition =
        this.$refs.cityList.scrollTop + this.$refs.cityList.clientHeight;
      const scrollThreshold =
        this.$refs.cityList.scrollHeight - this.$refs.cityList.clientHeight;

      if (scrollPosition >= scrollThreshold) {
        if (
          (this.currentPage + 1) * this.itemsPerPage <
          this.filteredCities.length
        ) {
          this.currentPage++;
          this.visibleCities.push(
            ...this.filteredCities.slice(
              this.currentPage * this.itemsPerPage,
              (this.currentPage + 1) * this.itemsPerPage
            )
          );
        }
      }
    },
  },
};
</script>

<style scoped>
input {
  border-radius: 5px;
  margin-right: 5px;
  font-size: 16px;
  padding: 10px;
  width: 100%;
}

ul {
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 200px;
  border-top: none;
  overflow-y: auto;
  width: 100%;
}

li {
  cursor: pointer;
  padding: 10px;
}

button {
  background-color: rgb(167, 164, 164);
  border-radius: 5px;
  color: white;
  height: auto;
  width: 40px;
}
.content {
  display: flex;
}
</style>
