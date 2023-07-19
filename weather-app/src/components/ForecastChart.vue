<template>
  <div v-if="weatherData" class="forecast-chart">
    <h3>Forecast for {{ weatherData.length }} days</h3>
    <div v-for="data in weatherData" :key="data.date" class="forecast-item">
      <p class="date">{{ data.date }}</p>
      <p>
        Temperature:
        {{ data.avgTemp.toFixed(getRoundingDigits(data.avgTemp)) }}°C
      </p>
      <p>
        Humidity:
        {{ data.avgHumidity.toFixed(getRoundingDigits(data.avgHumidity)) }}%
      </p>
      <p>
        Description:
        {{ data.description }}
      </p>
    </div>
  </div>
  <div v-else class="preloaders">
    <span>Forecast unavailable</span>
  </div>
</template>

<script>
export default {
  props: {
    city: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      weatherData: [],
    };
  },
  methods: {
    async fetchDaysForecast() {
      try {
        const apiKey = "36c415082cd1b09d49c15ce6dc314676";
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        this.weatherData = data.list.reduce((acc, item) => {
          const date = item.dt_txt.split(" ")[0];
          const temp = item.main.temp;
          const humidity = item.main.humidity;
          const description =
            item.weather && item.weather.length > 0
              ? item.weather[0].description
              : "N/A";

          const existingData = acc.find((data) => data.date === date);
          if (existingData) {
            existingData.temps.push(temp);
            existingData.humidities.push(humidity);
          } else {
            acc.push({
              date,
              temps: [temp],
              humidities: [humidity],
              description: description,
            });
          }

          return acc;
        }, []);

        this.weatherData.forEach((data) => {
          data.avgTemp =
            data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length;
          data.avgHumidity =
            data.humidities.reduce((sum, humidity) => sum + humidity, 0) /
            data.humidities.length;
        });
      } catch (error) {
        console.error("Error fetching 5 days forecast:", error);
      }
    },
    getRoundingDigits(value) {
      return value % 1 === 0 ? 0 : 1;
    },
  },
  created() {
    this.fetchDaysForecast();
  },
};
</script>

<style scoped lang="scss">
.forecast-chart {
  margin-top: 20px;
}

.forecast-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.date {
  font-weight: bold;
  font-size: 14px;
}
</style>
