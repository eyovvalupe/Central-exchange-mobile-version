<template>
  <div class="stockPopup">
    <MarketInfo :from="'contract'" :type="props.type" @back="back" :innerPage="true" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import store from "@/store";
import MarketInfo from "../Market/MarketInfo.vue"
import Chart from "../Market/Chart.vue";

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const back = () => {
  store.commit('setShowOpenPositionBottom', false)
}
</script>

<style lang="less" scoped>
.stockPopup {
  height: 100%;
  width: 100%;
  background-color: var(--ex-bg-color9);
}
</style>
