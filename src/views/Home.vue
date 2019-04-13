<template>
  <div class="home"></div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      dataset: [],
      isRequesting: false,
      hadError: ""
    };
  },
  methods: {
    /**
     * GetStockHistories: This method will fire a GET request and then
     * assign the response data into the state property: dataset
     */
    async GetStockHistories() {
      this.isRequesting = true;
      try {
        const result = await this.axios.get("/stocks");
        this.dataset = result.data;
      } catch (e) {
        this.hadError =
          "There was an issue while fetching the information. Please reload the page.";
      }
      this.isRequesting = false;
    }
  },
  created() {
    // Fecth the initial data
    this.GetStockHistories();
  }
};
</script>
