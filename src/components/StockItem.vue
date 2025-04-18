<!-- 股票单个元素 -->
<template>
  <div ref="root" style="overflow: visible;" class="w-full mask-btn-stock ">
    <SwipeCell :class="['stock_item_box']" @touchstart.start="" @touchmove.stop="" @touchend.stop="">
      <div class="stock_item_bg"
        :class="[`${' stock_item_' + updownStatus} ${props.page == 'home' ? '' : 'px-[0.28rem]'}`]"
        @click="goInfo(props.type || props.item.type)" v-if="props.item">
        <div :class="['stock_item']">
          <div class="size-[0.8rem] mr-[0.2rem] flex justify-center items-center"
            v-if="props.showIcon === true || (props.showIcon !== false && ['crypto', 'forex'].includes(props.item.type))">
            <CryptoIcon v-if="props.item.type == 'forex'" :name="item.symbol" />
            <CryptoIcon v-else :name="item.name.split('/')[0]" />
          </div>
          <div class="td5" :class="{ 'td5--ac': showIcon }">
            <div class="item_name flex items-center gap-1">
              <span class="truncate" v-if="props.item.type != 'stock' && props.item.type != 'blocktrade'">{{
                props.item.name
              }}</span>
              <template v-else>
                <span class="truncate" :class="page == 'home' ? '!text-[0.32rem]' : ''">{{ props.item.symbol }}</span>
                <span v-if="page != 'home' && marketMap[props.item.type] && !hideMarketTag"
                  :class="`${marketStyle[props.item.type]
                    } font-normal whitespace-nowrap text-[0.22rem] rounded-[0.08rem] px-[0.12rem] h-[0.32rem]  flex items-center justify-center ]`">
                  {{
                    marketMap[props.item.type]
                  }}
                </span>
              </template>


            </div>
            <div class="item_info mt-[0.16rem]" v-if="props.item.type == 'stock' || props.item.type == 'blocktrade'">
              {{ props.item.name || "--" }}
            </div>
            <div class="flex items-center mt-[0.16rem]" v-else-if="!hideMarketTag && marketMap[props.item.type]">
              <span
                :class="`${marketStyle[props.item.type]
                  } font-normal whitespace-nowrap text-[0.22rem] rounded-[0.08rem] px-[0.12rem] h-[0.32rem]  flex items-center justify-center ]`">
                {{
                  marketMap[props.item.type]
                }}
              </span>
            </div>

          </div>
          <div style="flex: 1.1;" :class="['spark_line_box']" v-if="showSparkLine">
            <SparkLine :style="['width: 100%; height: 0.6rem;']" v-if="props.item.points" :points="props.item.points"
              :ratio="props.item.ratio" />
          </div>
          <!-- <div :class="['td2']" v-if="showSparkLine">
            <SparkLine :style="['width: 100%; height: 0.6rem;']" v-if="props.item.points" :points="props.item.points"
              :ratio="props.item.ratio" />
          </div> -->
          <div class="td2 td_r">
            <div class="item_num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              {{ props.item.price ? props.item.price : "--" }}
            </div>
            <div class="item_info_box" @click.stop="() => (mode = mode == 3 ? 1 : mode + 1)">
              <div v-if="props.item.ratio !== undefined" class="item_percent"
                :class="[updown === 0 ? '' : updown > 0 ? 'up_bg' : 'down_bg']">
                <span v-if="mode == 1">{{
                  (props.item.ratio || 0) > 0
                    ? "+" + (props.item.ratio || 0)
                    : props.item.ratio || 0
                }}%</span>
                <span v-else-if="mode == 2">{{
                  props.item.price || 0 > 0
                    ? "+" + (props.item.price || 0)
                    : (props.item.price || 0)
                }}</span>
                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #right v-if="props.deleteItem">
        <div :class="['delete_content']" @click="removeStock(item)">
          <div class="delete_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/delete.svg')" alt="" />
          </div>
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup>
import ciper from "@/utils/ciper.js"
import { getStaticImgUrl } from "@/utils/index.js";
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch } from "vue";
import router from "@/router";
import { SwipeCell } from "vant";
import store from "@/store";
import { _formatNumber } from "@/utils/index";
import { useI18n } from "vue-i18n";
import CryptoIcon from "./CryptoIcon.vue";

const { t } = useI18n();
const marketMap = ref({
  stock: t("market.market_optional_stock"),
  crypto: t("market.market_optional_contract"),
  forex: t("market.market_optional_forex"),
  blocktrade: t("market.market_optional_blocktrade"),
  spot: t("market.market_optional_contract")
});
const marketStyle = {
  stock: "tag-stock",
  crypto: "tag-stock",
  forex: "tag-stock",
  blocktrade: "tag-stock",
  spot: "tag-stock"
};
const emits = defineEmits(["remove"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  scrollDom: {
    // 滚动的父级
    type: String,
    default: ".page",
  },
  deleteItem: {
    // 是否可以滑动删除
    type: Boolean,
    default: false,
  },
  type: {
    //从交易页面侧边栏点击
    type: String,
    default: "",
  },
  handleClick: {
    type: Function,
    default: null,
  },
  marketType: {
    type: String,
  },
  showSparkLine: {
    type: Boolean,
    default: true,
  },
  page: {
    type: String,
    default: "",
  },
  padding: {
    type: Boolean,
    default: false
  },
  showIcon: Boolean,
  hideMarketTag: Boolean
});


const mode = ref(1);
const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (props.item.ratio === undefined) return 0;
  return props.item.ratio > 0 ? 1 : -1;
});
const price = computed(() => props.item.price | 0);

const updownStatus = ref("");
watch(price, (newVal, oldVal) => {
  if (newVal && oldVal) {
    if (newVal > oldVal) {
      // 上升
      updownStatus.value = "up";
    } else {
      // 下降
      updownStatus.value = "down";
    }
    setTimeout(() => {
      updownStatus.value = "";
    }, 1000);
  }
});

const goInfo = (type) => {
  if (props.handleClick) return props.handleClick(props.item, props.menuType);
  switch (type) {
    case 'stock': // 股票
      store.commit("setCurrStockItem", props.item);
      break
    case 'spot': // 现货
      store.commit("setCurrSpot", props.item);
      break
    case 'ai': // ai
      store.commit("setCurrAi", props.item);
      break;
    case 'crypto': // 合约
    case "constract":
      if (props.item.tradeType == 'ai') { // ai
        store.commit("setCurrAi", props.item);
        type = 'ai'
      } else {
        store.commit("setCurrConstract", props.item);
      }
      break
    case 'forex': // 外汇
    case "foreign":
      store.commit("setCurrForeign", props.item);
      break
    case 'blocktrade': // 大宗
    case "commodities":
      store.commit("setCurrCommodities", props.item);
      break
  }
  router.push({
    name: "market_info",
    query: {
      symbol: ciper.encrypt(props.item.symbol),
      tradeType: type,
      type: type,
    },
  });
  // 左侧菜单点击
  // if (props.type === "trade") {
  //   const data = [
  //     {
  //       name: props.item.name,
  //       symbol: props.item.symbol,
  //     },
  //   ];
  //   store.commit("setShowLeft", false);
  //   store.commit("setChooseSymbol", data);
  //   return;
  // }
};


const removeStock = (item) => {
  emits("remove", item);
};

</script>

<style lang="less" scoped>
.stock_item_box {
  width: 100%;
  border-radius: 0.12rem;
  overflow: visible;

  .delete_content {
    width: 0.8rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-color4);
    border-radius: 0.32rem;

    .delete_icon {
      width: 0.4rem;
      height: 0.4rem;
    }
  }

  .delete_content_crypto {
    width: 0.8rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-color4);
    border-radius: 0.32rem;
    margin-left: -0.32rem;

    .delete_icon {
      font-size: 0.52rem;
      height: 0.52rem;
    }
  }

  :deep(.van-swipe-cell__wrapper) {
    overflow: visible;
  }
}

.active_symbol {
  background-color: var(--ex-bg-color3);
}

.stock_item {
  display: flex;
  align-items: center;
  height: 1.34rem;
  // padding: 0 0.3rem;
  position: relative;
  // background-color: var(--ex-bg-white2);
  // border-radius: 0.4rem;
  // margin-top: 0.2rem;
  border-bottom: 1px solid var(--ex-bg-white2);

  .td5 {
    flex-shrink: 0;
    flex: 3.4;
    overflow: hidden;

    .item_name {
      font-size: 0.28rem;
      color: var(--ex-text-color);
      line-height: 0.32rem;
      font-weight: 600;
    }

    .item_info {
      font-size: 0.24rem;
      line-height: 0.332rem;
      color: var(--ex-text-color3);
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 0.2rem;
    }
  }

  .td5--ac {
    // width: 2.3rem;
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      color: var(--ex-text-color2);
    }

    .item_info_box {
      margin-top: 0.12rem;

      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 400;
        color: var(--ex-white);
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: var(--ex-text-color2);
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding: 0 0.1rem;
  }
}

.stock_item_home {
  // background-color: var(--ex-bg-color2);
}

.stock_item_crypto {
  display: flex;
  align-items: center;
  height: 1rem;
  padding: 0 0.32rem;
  position: relative;
  margin-bottom: 0.1rem;

  // ::after {
  //   content: "";
  //   width: calc(100% - 0.6rem);
  //   position: absolute;
  //   bottom: 0;
  //   left: 0.3rem;
  //   height: 1px;
  //   background-color: var(--ex-bg-color3);
  // }

  .td5 {
    // flex: 5;
    flex-shrink: 0;
    width: 3.6rem;
    // overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: var(--ex-text-color);
      line-height: 0.46rem;
      font-weight: 600;
      margin-bottom: 0.06rem;
    }

    .item_info {
      font-size: 0.28rem;
      line-height: 0.36rem;
      color: var(--ex-text-color3);
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 0.4rem;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      color: var(--ex-text-color2);
    }

    .item_info_box {
      margin-top: 0.1rem;

      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 600;
        color: var(--ex-white);
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: var(--ex-text-color2);
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 0.4rem;
    padding-left: 0.2rem;
  }
}

.stock_item_bg {
  // border-radius: 0.32rem;
  transition: all ease-in .2s;
  position: relative;
  overflow: visible;
  border-radius: 0.12rem;

  &::after {
    position: absolute;
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    right: -0.32rem;
    background-color: rgb(var(--ex-none) / 0.06);
    transition: all ease-in .2s;
    // border-radius: 0 0.32rem 0.32rem 0;
  }

  &::before {
    position: absolute;
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    left: -0.32rem;
    background-color: rgb(var(--ex-none) / 0.06);
    transition: all ease-in .2s;
    // border-radius: 0.32rem 0 0 0.32rem;
  }
}

.stock_item_bg:active {
  transition: none;
  background-color: var(--ex-bg-white2);
}

.stock_item_up {
  background-color: rgb(var(--ex-up-color-rgb) / 0.06);
  transition: all ease-in .2s;

  &::after {
    position: absolute;
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    right: -0.32rem;
    background-color: rgb(var(--ex-up-color-rgb) / 0.06);
    transition: all ease-in .2s;
    // border-radius: 0 0.32rem 0.32rem 0;
  }

  &::before {
    position: absolute;
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    left: -0.32rem;
    background-color: rgb(var(--ex-up-color-rgb) / 0.06);
    transition: all ease-in .2s;
    // border-radius: 0.32rem 0 0 0.32rem;
  }

  .stock_item {
    // border-bottom: 1px solid rgb(var(--ex-up-color-rgb) / 0.06);
  }
}

.stock_item_down {
  background-color: rgb(var(--ex-down-color-rgb) / 0.06);
  transition: all ease-in .2s;

  &::after {
    position: absolute;
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    right: -0.32rem;
    background-color: rgb(var(--ex-down-color-rgb) / 0.06);
    transition: all ease-in .2s;
    // border-radius: 0 0.32rem 0.32rem 0;
  }

  &::before {
    position: absolute;
    content: "";
    width: 0.32rem;
    height: 100%;
    top: 0;
    left: -0.32rem;
    background-color: rgb(var(--ex-down-color-rgb) / 0.06);
    transition: all ease-in .2s;
    // border-radius: 0.32rem 0 0 0.32rem;
  }

  .stock_item {
    // border-bottom: 1px solid rgb(var(--ex-down-color-rgb) / 0.06);
  }
}

.delete_icon {
  width: 0.36rem;
  height: 0.34rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
