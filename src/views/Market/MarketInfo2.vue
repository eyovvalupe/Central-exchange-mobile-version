<!-- 市场行情 -->
<template>
  <div class="page-marketinfo2"
    :style="{ backgroundColor: props.innerPage ? 'var(--ex-bg-color9)' : 'var(--ex-bg-color)' }">
    <!-- 头部 -->
    <div class="max-width info_header"
      :style="{ zIndex: props.innerPage ? 1 : 100, backgroundColor: props.innerPage ? 'var(--ex-bg-color9)' : 'var(--ex-bg-color)' }">
      <div v-if="!props.innerPage" class="top">
        <div v-if="!props.innerPage" class="back" @click="router.back">
          <Icon name="arrow-left" />
        </div>

        <!-- 标题 -->
        <div class="title" v-if="item.type == 'stock'">
          <div class="title_name">{{ item.symbol || "--" }}
          </div>
          <div class=" leading-[0.4rem]" v-if="item.name">
            {{ item.name || "--" }}
          </div>
        </div>
        <div class="title" v-else>
          <div class="title_name">{{ item.name || "--" }}
          </div>
        </div>
        <!-- 详情 -->
        <div class="title_shadow"></div>
        <div v-if="!props.innerPage" class="search star" @click="addCollect"
          :style="{ opacity: loading ? '0.5' : '1' }">
          <div class="size-[0.48rem]">
            <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
            <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
          </div>
        </div>

      </div>
      <div :style="{ backgroundColor: props.innerPage ? 'var(--ex-bg-white2)' : 'var(--ex-bg-color3)' }"
        style="border-radius: 0.32rem;padding: 0.08rem 0.08rem 0.2rem 0.28rem">

        <div class="flex items-center justify-center gap-[0.2rem]">

          <div class="w-[2.6rem] flex-shrink-0">
            <h1 class="flex items-center" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              <span class="text-[0.4rem] font-[600]" v-if="item.price || item.close">
                {{ item.price || item.close }}
              </span>
              <span class="text-[0.4rem] font-[600]" v-else>--</span>
              <span class="w-[0.24rem] h-[0.26rem] ml-[0.06rem] mt-[0.06rem]">
                <img v-lazy="getStaticImgUrl('/static/img/market/up_icon.svg')" v-if="updown > 0" />
                <img v-lazy="getStaticImgUrl('/static/img/market/down_icon.svg')" v-else-if="updown < 0" />
              </span>
            </h1>
            <div class="flex mt-[0.2rem]" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              <div class="text-[0.24rem]" v-if="item.price * (item.ratio || 0)">
                {{ updown === 0 ? "" : updown > 0 ? "+" : "" }}
                {{ item.change ? item.change : '--' }}
              </div>
              <div class="text-[0.24rem] ml-[0.16rem]" v-if="item.ratio">
                {{
                  item.ratio === undefined
                    ? "--"
                    : item.ratio > 0
                      ? "+" + item.ratio + "%"
                      : item.ratio + "%"
                }}
              </div>
            </div>
          </div>
          <div class="count flex-1">
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_high') }}</span>
              <span class="num text-white">{{ item.high || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_low') }}</span>
              <span class="num text-white">{{ item.low || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_open') }}</span>
              <span class="num text-white">{{ item.open || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_close') }}</span>
              <span class="num text-white">{{ item.close || '--'
              }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_value') }}</span>
              <span class="num text-white">{{ _formatNumber(item.amount) }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_amount') }}</span>
              <span class="num text-white">{{ _formatNumber(item.volume) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div v-if="item.type == 'crypto' && type != 'ai'" :class="[props.innerPage ? 'inner-marketinfo' : '']"
      style="padding: 0 0.1rem;margin-top: 0.1rem;"
      :style="{ backgroundColor: props.innerPage ? 'var(--ex-none' : 'var(--ex-bg-color)' }">
      <Tabs :style="{ backgroundColor: props.innerPage ? 'var(--ex-bg-white2)' : 'var(--ex-bg-color3)' }"
        style="border-radius: 0.32rem 0.32rem 0 0;" class="van-tabs--sub_line van-tabs--sub_bg" :sticky="true"
        :color="'var(--ex-primary-color)'" v-model:active="activeTab" animated shrink>
        <Tab :name="2" :title="$t('market.market_item_detail')">
          <div class="market-box">
            <Chart ref="chartRef" v-if="!chartLoading" :type="type" />
          </div>
        </Tab>
        <Tab :name="3" :title="$t('market.market_item_order')">
          <div class="market-box">
            <OrderingSpot :tradeType="type" :innerPage="innerPage" v-if="activeTab == 3" :key="'o'" type="nomal" />
          </div>
        </Tab>
        <Tab :name="4" :title="$t('market.market_item_news')">
          <div class="market-box">
            <OrderingSpot :tradeType="type" :innerpage="innerPage" v-if="activeTab == 4" :key="'n'" type="news" />
          </div>
        </Tab>
      </Tabs>
    </div>
    <div class="market-box market-box2" v-else>
      <Chart ref="chartRef" v-if="!chartLoading" :type="type" />
    </div>

    <!-- 去交易按钮 -->
    <div class="bottom-box" v-if="!props.innerPage">
      <div class="info">
        <div class="name">{{ (item.type == 'stock' ? item.symbol : item.name) || "--" }}</div>
        <div class="type" v-if="chartRef">{{ chartRef.timeType }}</div>
      </div>
      <div style="flex: 1;"></div>
      <div class="data" @click="showInfo = true">{{ $t('market.market_marketinfo_data') }}</div>
      <div class="btn" :class="{ 'disabled-btn': isDisabled }" @click="gotrade">{{ $t('market.market_marketinfo_trade')
      }}
      </div>
    </div>
    <div v-else style="height:0.12rem"></div>



    <!-- 数据弹窗 -->
    <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showInfo"
      :title="t('market.market_marketinfo_data')" closeable>
      <div class="info_popup">
        <div class="info_price"
          :style="{ backgroundColor: updown > 0 ? 'rgb(var(--ex-up-color-rgb) / 0.06)' : 'rgb(var(--ex-down-color-rgb) / 0.06)' }">
          <div class="info_num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
            <template v-if="item.price || item.close">
              {{ item.price || item.close }}
            </template>
            <span v-else>--</span>
          </div>
          <div style="display: flex; align-items: center" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
            <div v-if="Number(item.change)" :class="[
              updown === 0 ? '' : updown > 0 ? 'price_up' : 'price_down',
            ]">
              {{ updown === 0 ? "" : updown > 0 ? "+" : ""
              }}{{ item.change }}
            </div>
            <div v-if="item.ratio" style="margin-left: 0.15rem" :class="[
              updown === 0
                ? ''
                : updown > 0
                  ? 'percentage_up'
                  : 'percentage_down',
            ]">
              {{
                updown === 0 || item.ratio === undefined
                  ? ""
                  : updown > 0
                    ? "+"
                    : ""
              }}{{ item.ratio === undefined ? "--" : item.ratio + "%" }}
            </div>
          </div>
        </div>
        <div class="info_items">
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_open") }}</div>
            <div class="info_item__value">{{ item.open }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_high") }}</div>
            <div class="info_item__value">{{ item.high }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_amount") }}</div>
            <div class="info_item__value">{{ _formatNumber(item.volume) }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_close") }}</div>
            <div class="info_item__value">{{ item.close }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_low") }}</div>
            <div class="info_item__value">{{ item.low }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_value") }}</div>
            <div class="info_item__value">{{ _formatNumber(item.amount) }}</div>
          </div>
        </div>
      </div>
    </BottomPopup>


    <!-- 跳转选择 -->
    <BottomPopup round :title="'交易类型'" v-model:show="showJumpDialog" position="bottom" closeable teleport="body">
      <div class="jumps-lists">
        <div @click="clickJumpItem(item)" class="jumps-item" v-for="item in jumpArr" :key="item">{{ titleMap[item] }}
        </div>
      </div>
    </BottomPopup>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router/index"
import store from "@/store";
import { getStaticImgUrl, _formatNumber } from "@/utils/index.js"
import { Tab, Tabs, Icon, showToast } from "vant";
import { _basic, _add, _del } from "@/api/api";
import BottomPopup from "@/components/BottomPopup.vue";
import OrderingSpot from "./OrderingSpot.vue"
import Chart from "./Chart.vue"



const props = defineProps({
  tradeType: {
    type: String,
    default: "",
  },
  innerPage: { // 内联页
    type: Boolean,
    default: false
  }
});

const { t } = useI18n();
const route = useRoute();
const token = computed(() => store.state.token);
const chartRef = ref()


// 跳转交易
const jumpArr = ref([])
const showJumpDialog = ref(false)
const gotrade = () => {
  if (isDisabled.value) return showToast('不可交易')
  if (route.query.check == '1') {
    let arr = []
    for (let key in tradeKeyMap) {
      if (item.value[tradeKeyMap[key]]) {
        arr.push(key)
      }
    }
    arr = Array.from(new Set(arr))
    if (!arr.length) return showToast('不可交易')
    if (arr.length == 1) {
      clickJumpItem(arr[0])
    } else { // 打开选择框
      jumpArr.value = arr
      showJumpDialog.value = true
    }
  } else {
    router.push({
      name: 'tradeInfo',
      query: route.query
    })
  }
}
const clickJumpItem = (tt) => {
  showJumpDialog.value = false
  switch (tt) {
    case 'spot':
      store.commit('setCurrSpot', item.value || {});
      break;
    case 'constract':
      store.commit('setCurrConstract', item.value || {});
      break;
    case 'stock':
    case 'ai':
      store.commit('setCurrAi', item.value || {});
      break;
  }
  router.push({
    name: 'tradeInfo',
    query: {
      symbol: route.query.symbol,
      tradeType: tt
    }
  })
}


const activeTab = ref(2)
const showInfo = ref(false);
const type = computed(() => props.tradeType || route.query.tradeType)

// 股票信息
const item = computed(() => {
  let it = {};
  switch (type.value) {
    case "spot":
      it = store.state.currSpot || {};
      break;
    case "constract": // 合约
      it = store.state.currConstact || {};
      break;
    case "stock":
    case "ai":
      it = store.state.currAi || {};
      break;
  }
  return it;
});
// 检测是否可交易
const titleMap = {
  stock: '期货',
  spot: '现货',
  constract: '合约',
  ai: '期货',
}
const tradeKeyMap = {
  'stock': 'aiquant',
  'spot': 'trade',
  'constract': 'futures',
  'ai': 'aiquant',
}
const isDisabled = computed(() => {
  // 如果是未知来源的则判断所有类型
  if (route.query.check == '1') {
    let dis = true
    for (let key in tradeKeyMap) {
      if (item.value[tradeKeyMap[key]] == 1 || item.value[tradeKeyMap[key]] == 2) {
        dis = false
      }
    }
    return dis
  } else { // 否则判断当前tradeType
    if (item.value[tradeKeyMap[type.value]] == 1 || item.value[tradeKeyMap[type.value]] == 2) {
      return false
    }
    return true
  }
})


const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (item.value.ratio === undefined) return 0;
  return item.value.ratio > 0 ? 1 : -1;
});


// 获取股票最新信息
const getBasic = (obj) => {
  switch (type.value) {
    case "spot":
      store.commit("setCurrSpot", obj);
      break;
    case "constract": // 合约
      store.commit("setCurrConstract", obj);
      break;
    case "stock":
    case "ai":
      store.commit("setCurrAi", obj);
      break;
  }
  _basic({ symbol: obj.symbol }).then((res) => {
    if (res.code == 200) {
      if (res.data.symbol == item.value.symbol) {
        switch (type.value) {
          case "constract": // 合约
            store.commit("setCurrConstract", {
              ...obj,
              ...res.data,
            });
            break;
          case "spot":
            store.commit("setCurrSpot", {
              ...obj,
              ...res.data,
            });
            break;
          case "stock":
          case "ai":
            store.commit("setCurrAi", {
              ...obj,
              ...res.data,
            });
            break;
        }
      }
    }
  });
}
setTimeout(() => {
  if (item.value.symbol) {
    getBasic(item.value)
  }
}, 200)
const chartLoading = ref(true)
onMounted(() => {
  setTimeout(() => {
    chartLoading.value = false
  }, 300)
})
const handleClick = (obj) => {
  activeTab.value = 1
  chartLoading.value = true
  getBasic(obj)
  setTimeout(() => {
    chartLoading.value = false
  }, 100)
};


// 添加自选
const loading = ref(false);
const addCollect = () => {
  if (!token.value) return store.commit("setIsLoginOpen", true);
  if (loading.value) return;
  loading.value = true;
  if (!item.value.watchlist) {
    _add({
      symbol: item.value.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          store.dispatch('updateMarketWatchList');
          switch (type.value) {
            case "constract": // 合约
              store.commit("setCurrConstract", { watchlist: 1 });
              break;
            case "spot":
              store.commit("setCurrSpot", { watchlist: 1 });
              break;
            case "stock":
            case "ai":
              store.commit("setCurrAi", { watchlist: 1 });
              break;
          }
          // showToast(t('market.market_optional_add_success'));
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    _del({
      symbol: item.value.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          store.dispatch('updateMarketWatchList');
          switch (type.value) {
            case "constract": // 合约
              store.commit("setCurrConstract", { watchlist: 0 });
              break;
            case "spot":
              store.commit("setCurrSpot", { watchlist: 0 });
              break;
            case "stock":
            case "ai":
              store.commit("setCurrAi", { watchlist: 0 });
              break;
          }
          // showToast(t('market.market_optioanl_del_success'));
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};


</script>

<style lang="less" scoped>
.jumps-lists {
  padding: 0.6rem 0.32rem;

  .jumps-item {
    height: 0.92rem;
    border-radius: 1rem;
    background-color: var(--ex-bg-white2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.32rem;
    color: var(--ex-white);

    &:active {
      background-color: var(--ex-primary-color);
    }
  }
}

.search_dialog_trade {
  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.32rem;
    padding: 0 0.32rem;
  }

  .search_box {
    height: 0.8rem;
    padding: 0 0.32rem;
    margin: 0.4rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-white1);
    border-radius: 0.6rem;
    border: 1px solid var(--ex-border-color2);

    .search_icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.24rem;
    }

    .ipt {
      height: 100%;
      font-weight: 400;
    }

    .ipt::placeholder {
      color: var(--ex-text-color4);
    }
  }
}


.page-marketinfo2 {
  // padding: 1.8rem 0 0 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--ex-bg-color);

  .bottom-box {
    margin-top: 0.1rem;
    height: 1.4rem;
    background-color: var(--ex-bg-color3);
    border-radius: 0.32rem 0.32rem 0 0;
    padding: 0.18rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--ex-bg-white1);

    .info {
      .name {
        font-size: 0.32rem;
      }

      .type {
        margin-top: 0.16rem;
        color: var(--ex-text-color5);
        height: 0.36rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.4rem;
        padding: 0 0.16rem;
        display: inline-flex;
        border: 1px solid var(--ex-text-color5);
      }
    }

    .data {
      background-color: var(--ex-bg-white1);
      height: 0.92rem;
      border-radius: 1rem;
      color: var(--ex-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.32rem;
      padding: 0 0.4rem;
      margin-right: 0.12rem;
      white-space: nowrap;
    }

    .btn {
      background-color: var(--ex-status-color3);
      width: 2.88rem;
      height: 0.92rem;
      border-radius: 1rem;
      color: var(--ex-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.32rem;
    }

    .disabled-btn {
      background-color: var(--ex-bg-white1);
      color: var(--ex-text-color3);
    }
  }

  .market-box {
    margin-top: 0.1rem;
    height: calc(var(--vh) * 100 - 5.58rem)
  }

  .market-box2 {
    height: calc(var(--vh) * 100 - 4.6rem);
    margin: 0.1rem 0.1rem 0 0.1rem;
  }


  .has_padding_x {
    padding: 0 0.3rem;
  }

  .info_header {
    width: 100%;
    background-color: var(--ex-bg-color);
    padding: 0 0.1rem;
    z-index: 100;

    .top {
      display: flex;
      min-height: 1rem;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 0.88rem;
      margin-bottom: 0.1rem;
      padding: 0 0.2rem;

      .back {
        width: 0.6rem;
        height: 0.6rem;
        font-size: 0.32rem;
        background-color: var(--ex-bg-color3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title_shadow {
        flex: 1;
      }

      .star {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title {
        // pointer-events: none;
        position: absolute;
        width: calc(100% - 1.6rem);
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        left: 50%;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.24rem;
        line-height: 0.332rem;
        font-weight: 400;
        color: var(--ex-text-color3);

        .title_name {
          color: var(--ex-text-color);
          font-size: 0.32rem;
          line-height: 0.432rem;
          font-weight: 500;
        }
      }

    }

    .count {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      .count_item {
        color: var(--ex-text-color2);
        font-size: 0.22rem;
        font-weight: 400;
        line-height: 0.24rem;
        width: 50%;
        height: 0.54rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        word-break: break-all;

        .num {
          margin-left: 0.1rem;
        }
      }
    }
  }



  @media (min-width: 751px) {


    .info_header {
      max-width: 375px;
    }
  }

}

.info_popup {
  padding: 0.4rem 0.32rem 0.2rem 0.32rem;

  .info_name {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: var(--ex-text-color);
    margin-bottom: 0.54rem;
    text-align: center;
  }

  .info_price {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.32rem;
    height: 1.3rem;
    padding: 0.24rem;
    // background: var(--ex-bg-color3);
    border-radius: 0.4rem;

    .info_num {
      font-size: 0.6rem;
      line-height: 0.81rem;
      font-weight: 600;
      margin-right: 0.2rem;
    }

    .price_up,
    .percentage_up {
      height: 0.56rem;
      display: flex;
      align-items: center;
      background: rgb(var(--ex-up-color-rgb) / 0.1);
      border-radius: 1.25rem;
      padding: 0.075rem 0.25rem;
    }

    .price_down,
    .percentage_down {
      height: 0.56rem;
      display: flex;
      align-items: center;
      background: rgb(var(--ex-down-color-rgb) / 0.1);
      border-radius: 1.25rem;
      padding: 0.075rem 0.25rem;
    }
  }

  .info_items {
    margin: 0.32rem 0 0 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .info_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.32rem;
      width: 31%;
      background-color: var(--ex-bg-white2);
      border-radius: 0.4rem;
      height: 1.26rem;

      .name {
        margin-top: 0.2rem;
        color: var(--ex-bg-color8);
      }

      .info_item__value {
        font-weight: 600;
      }
    }
  }
}


.inner-marketinfo {
  :deep(.van-tabs--sub_bg) {
    .van-sticky>div>.van-tabs__wrap .van-tabs__nav {
      background-color: var(--ex-none);
    }
  }

  :deep(.market-charts) {
    .chart_box {
      background-color: var(--ex-none);

      .tabs {
        .tab {
          background-color: var(--ex-bg-white1);
        }

        .active_tab {
          background-color: var(--ex-white);
        }
      }

      .chart_container {
        .chart_time {
          background-color: var(--ex-bg-white1);
        }
      }
    }
  }
}
</style>