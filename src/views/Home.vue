<template>
  <div class="home">
    <!-- Chart options -->
    <div class="options">
      <!-- Limit -->
      <div class="option__block">
        <label>Limit</label>
        <select v-model="options.limit" @change="ChartOptions(options.limit)">
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="500">500</option>
        </select>
      </div>
      <!-- Date range -->
      <div class="option__block">
        <label>Year range</label>
        <select>
          <option value=""></option>
        </select>
      </div>
    </div>
    <vue-c3 :handler="handler" />
  </div>
</template>

<script>
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
        limit: 50
      },
      dataset: [],
      isRequesting: false,
      hadError: ""
    };
  },
  components: {
    VueC3
  },
  methods: {
    /**
     * GetStockHistories: This method will fire a GET request and then
     * assign the response data into the state property: dataset
     */
    async GetStockHistories(limit = 50) {
      try {
        const query = `limit=${limit}`;

        const stocks = await this.axios.get(`/stocks?${query}`);
        const volumeColumn = ["Volume"];
        const lowColumn = ["Low"];
        const highColumn = ["High"];
        const adjustedClosePriceColumn = ["Adjusted close price"];
        const openColumn = ["Open"];
        const dateColumn = ["Date"];
        // Format the dataset to C3 structure
        for (let stock of stocks.data) {
          volumeColumn.push(stock.volume);
          lowColumn.push(stock.low);
          highColumn.push(stock.high);
          adjustedClosePriceColumn.push(stock.adjustedClosePrice);
          openColumn.push(stock.open);
          dateColumn.push(moment(stock.date).format("YYYY-MM-DD"));
        }

        // console.log(dateColumn);
        const result = [openColumn, dateColumn];
        return Promise.resolve(result);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    async ChartOptions(limit) {
      try {
        const result = await this.GetStockHistories(limit);
        this.handler.$emit("dispatch", chart => {
          return chart.load({
            columns: result
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    async InitLineChart() {
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
    this.InitLineChart();
  }
};
</script>
