<template>
  <div class="ipo-detail-box">
    <div class="ipo-detail-header">
      <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
      <span>中签详情</span>
    </div>

    <Loading v-show="loading" type="circular" class="position-loading"></Loading>
    <div class="ipo-box" v-if="!loading">
      <div class="ipo-co-f">
        <div class="h-co-title">
          {{ data.company_name }}
        </div>
        <div class="ipo-up-button" v-if="data.status == 'listed'">已上市</div>
        <div class="ipo-up-button" v-else>发行中</div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">股票代码</div>
        <div class="ipo-text">{{ data.symbol }}</div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">认购价格</div>
        <div class="ipo-text">
          {{ data.issue_price }}
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">认购开始日期</div>
        <div class="ipo-text">
          {{ data.issue_start_date }}
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">认购结束日期</div>
        <div class="ipo-text">
          {{ data.issue_end_date }}
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">上市日期</div>
        <div class="ipo-text">
          {{ data.listing_date }}
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">上市价格</div>
        <div class="ipo-text">
          {{ data.listing_price }}
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">认购数量</div>
        <div class="ipo-text">
          {{ data.volume }}
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">VIP 认购</div>
        <div class="ipo-text">{{ data.lever }}倍</div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">VIP 利息</div>
        <div class="ipo-text"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { Icon, Loading } from "vant";
import { useRouter, useRoute } from "vue-router";
import { _orderGet } from "@/api/api";
import store from "@/store";

const route = useRoute();
const router = useRouter();
const data = ref({});
const loading = ref(false);

const id = computed(() => {
  return store.state.ipoId;
});

const ipoDetail = computed(()=>{
  return store.state.ipoDetail
})

const goTotrade = () => {
  if (route.query.type === "market") {
    router.push({ name: "market" });
  } else if (route.query.type === "winning") {
    router.push({ name: "trade", query: { type: "winning" } });
  } else {
    router.push({ name: "trade", query: { type: "ipodetail" } });
  }
};

const getList = () => {
  _orderGet({ order_no: id.value })
    .then((res) => {
      if (res.code == 200) {
        data.value = res.data;
        loading.value = false;
      } else {
        loading.value = false;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loading.value = true;
  getList();
});
</script>

<style lang="less">
.ipo-detail-box {
  position: relative;
  padding: 0 0.3rem;
  background-color: var(--ex-bg-color);
  .arrow-left {
    position: absolute;
    left: 0.3rem;
    top: 0.36rem;
  }
  .position-loading {
    margin-top: 2rem !important;
    .van-loading__spinner {
      left: 45%;
    }
  }
  .ipo-detail-header {
    padding: 0.3rem 0;
    background-color: var(--ex-bg-color);
    color: var(--ex-text-color);
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.52rem;
    text-align: center;
  }
  .ipo-box {
    .ipo-box-flex {
      display: flex;
      justify-content: space-between;
      height: 1rem;
      line-height: 1rem;
      border-bottom: 0.02rem solid var(--ex-border-color);
      .ipo-title {
        color: var(--ex-text-color3);
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
      }
      .ipo-text {
        color: var(--ex-text-color);
        text-align: right;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
      }
    }
  }
  .ipo-co-f {
    display: flex;
    justify-content: space-between;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    .h-co-title {
      color: var(--ex-text-color);
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.46rem;
    }
    .ipo-up-button {
      width: 1.14rem;
      height: 0.46rem;
      background-color: var(--ex-bg-color6);
      color: var(--ex-primary-color);
      text-align: center;
      font-size: 0.2rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.46rem;
      border-bottom-left-radius: 0.28rem;
      border-top-right-radius: 0.12rem;
    }
  }
}
</style>
