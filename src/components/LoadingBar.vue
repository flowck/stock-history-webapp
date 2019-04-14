<template>
  <div
    class="loading-bar"
    :style="'background-color: ' + getColor + '; height: ' + getHeight + 'px;'"
  ></div>
</template>

<script>
export default {
  name: "LoadingBar",
  props: {
    BgColor: String,
    height: Number
  },
  computed: {
    getColor() {
      return this.BgColor || "#1c3766";
    },
    getHeight() {
      return this.height || "4";
    }
  }
};
</script>

<style lang="stylus" scoped>
.loading-bar
  top 0
  left 0
  content ""
  width 98%
  height 4px
  position absolute
  border-top-left-radius 3px
  border-top-right-radius 3px
  border-bottom-right-radius 3px
  background-color PRIMARY-COLOR
  animation loading 1s infinite

@keyframes loading
  from
    width 0
  to
    width 100%
</style>
