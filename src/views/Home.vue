<template>
  <div class="home">
    <!-- Chart options -->
    <div class="options">
      <!-- Limit -->
      <div class="option__block">
        <label>Limit</label>
        <select
          v-model="options.limit"
          @change="GetStocksWithParamQueries(options)"
        >
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="500">500</option>
        </select>
      </div>
      <!-- Year -->
      <div class="option__block">
        <label>From</label>
        <select
          v-model="options.year"
          @change="GetStocksWithParamQueries(options)"
        >
          <option v-for="year in yearsRange" :key="year" :value="year">{{
            year
          }}</option>
        </select>
      </div>
      <!-- Reset button -->
      <div class="option__block">
        <button :disabled="resetButtonStatus" @click="ResetResults">
          Reset
        </button>
      </div>
    </div>
    <vue-c3 :handler="handler" />
  </div>
</template>

<script>
// Dependencies
import moment from "moment";
import Vue from "vue";
import VueC3 from "vue-c3";
import { format } from "d3";
export default {
  name: "Home",
  data() {
    return {
      handler: new Vue(),
      options: {
        limit: 50,
        year: 2019
      },
      dataset: [],
      isRequesting: false,
      hadError: ""
    };
  },
  components: {
    VueC3
  },
  computed: {
    resetButtonStatus() {
      const { limit, year } = this.options;
      return limit === 50 && year === 2019 ? true : false;
    },
    yearsRange() {
      const result = [];
      const currentYear = new Date().getFullYear();
      const minYear = 1970;

      for (let i = minYear; i <= currentYear; i++) {
        result.push(i);
      }
      return result.reverse();
    }
  },
  methods: {
    /**
     * GetStockHistories: This method will fire a GET request and then
     * assign the response data into the state property: dataset
     */
    async GetStockHistories(options) {
      try {
        // API query options: limit, year
        const query = options
          ? `limit=${options.limit}&year=${options.year}`
          : null;

        // Request the data on /stocks [GET]
        const stocks = await this.axios.get(`/stocks?${query}`);

        // Set the columns
        const volumeColumn = ["Volume"];
        const lowColumn = ["Low"];
        const highColumn = ["High"];
        const adjustedClosePriceColumn = ["Adjusted close price"];
        const openColumn = ["Open"];
        const dateColumn = ["Date"];

        // Format the dataset to the C3 format
        for (let stock of stocks.data) {
          volumeColumn.push(stock.volume);
          lowColumn.push(stock.low);
          highColumn.push(stock.high);
          adjustedClosePriceColumn.push(stock.adjustedClosePrice);
          openColumn.push(stock.open);
          dateColumn.push(moment(stock.date).format("YYYY-MM-DD"));
        }

        // Return the dataset
        const result = [openColumn, dateColumn];
        return Promise.resolve(result);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    /**
     * GetStocksWithParamQueries: This method call the GetStockHistories method
     * by passing down a parameter object and then dispatch the results to the
     * chart.
     *
     * @param {object} queryOptions
     */
    async GetStocksWithParamQueries(queryOptions) {
      try {
        const result = await this.GetStockHistories(queryOptions);
        this.handler.$emit("dispatch", chart => {
          return chart.load({
            columns: result
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    ResetResults() {
      this.options = {
        limit: 50,
        year: 2019
      };

      this.GetStocksWithParamQueries(this.options);
    },
    async InitChart() {
      try {
        // Fecth the initial data
        const dataset = await this.GetStockHistories();
        const options = {
          data: {
            columns: dataset,
            x: "Date",
            y: "High"
          },
          axis: {
            x: {
              type: "timeseries",
              tick: {
                format: "%Y-%m-%d"
              }
            },
            y: {
              tick: {
                format: format("$,")
              }
            }
          }
        };
        this.handler.$emit("init", options);
      } catch (err) {
        console.log(err);
      }
    }
  },
  async mounted() {
    this.InitChart();
  }
};
</script>
