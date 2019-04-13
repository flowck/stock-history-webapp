<template>
  <div class="home">
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
    async GetStockHistories() {
      try {
        const stocks = await this.axios.get("/stocks");
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
    }
  },
  async mounted() {
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
};
</script>
