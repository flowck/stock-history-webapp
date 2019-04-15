<template>
  <div class="alert" :style="`background-color: ${color};`">
    <span>{{ message }}</span>
    <button @click="closeMethod" class="alert__close-btn" title="Close">
      Close
    </button>
  </div>
</template>

<script>
export default {
  name: "AlertBar",
  props: {
    message: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "#A63232"
    },
    closeMethod: {
      type: Function,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.alert
  left 0
  bottom 0
  width 100%
  color #FFF
  display flex
  position absolute
  padding 20px 10px
  justify-content space-between

.alert__close-btn
  color #FFF
  cursor pointer
  padding 5px 10px
  border-radius 3px
  border 1px solid #FFF
  background-color transparent
</style>
