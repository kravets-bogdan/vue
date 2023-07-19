<template>
  <div class="temperature-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";

export default {
  props: {
    city: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      temperatureData: [],
    };
  },
  mounted() {
    this.fetchTemperatureData();
  },
  methods: {
    fetchTemperatureData() {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=36c415082cd1b09d49c15ce6dc314676&units=metric&cnt=8`
      )
        .then((response) => response.json())
        .then((data) => {
          this.temperatureData = this.getAverageTemperatureData(data.list);
          this.renderChart();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getAverageTemperatureData(data) {
      const hours = {};

      data.forEach((item) => {
        const hour = new Date(item.dt_txt).getHours();
        if (!hours[hour]) {
          hours[hour] = {
            temperatureSum: item.main.temp,
            count: 1,
          };
        } else {
          hours[hour].temperatureSum += item.main.temp;
          hours[hour].count++;
        }
      });

      const averageData = [];
      for (let hour in hours) {
        const averageTemperature =
          hours[hour].temperatureSum / hours[hour].count;
        averageData.push(averageTemperature.toFixed(1));
      }

      return averageData;
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.$refs.chartCanvas.getContext("2d"), {
        type: "line",
        data: {
          labels: [
            "00:00",
            "03:00",
            "06:00",
            "09:00",
            "12:00",
            "15:00",
            "18:00",
            "21:00",
          ],
          datasets: [
            {
              label: "Temperature",
              data: this.temperatureData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  watch: {
    city() {
      this.fetchTemperatureData();
    },
  },
};
</script>

<style scoped lang="scss">
.temperature-chart {
  margin-top: 20px;
}
</style>
