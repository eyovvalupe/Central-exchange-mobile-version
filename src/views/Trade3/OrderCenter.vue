<template>
  <div class="trade_order_container">
    <Tabs class="trade_head_tabs" v-model:active="activeMainTab" :swipeable="false" animated shrink
      @change="(e) => onChange(e)">
      <Tab :title="'交易订单'" :name="1">
        <div class="order_tabs" @touchstart.stop="" @touchmove.stop="" @touchend.stop="">
          <HeaderTabs type="line" v-model:active="activeTab" :tabs="[
            t('现货'),
            t('加密货币合约'),
            t('trade.left_bot'),
            // t('assets.order_title_ipo'),
          ]" @change="changeActiveTab(activeTab)" />

          <div class="trade_order_tab p-[0.32rem]" v-if="activeTab == 0">
            <SpotOrderList :from="'trade'" />
          </div>

          <div class="trade_order_tab py-[0.32rem]" v-if="activeTab == 1">
            <CryptoOrderList :from="'trade'" />
          </div>

          <div class="trade_order_tab py-[0.32rem]" v-if="activeTab == 2">
            <AIOrderList :from="'trade'" />
          </div>
        </div>
      </Tab>
      <Tab :title="'理财订单'" :name="2">
        <div class="order_tabs" @touchstart.stop="" @touchmove.stop="" @touchend.stop="">
          <HeaderTabs type="line" v-model:active="activeFinanceTab" :tabs="[t('跟单'), t('DeFi借币'), t('质押挖矿')]"
            @change="changeActiveTab1(activeFinanceTab)" />
          <div class="trade_order_tab" v-if="activeFinanceTab == 0">
            <CopyOrders :from="'trade'" />
          </div>
          <div class="trade_order_tab" v-if="activeFinanceTab == 1">
            <PledgeOrder :from="'trade'" />
          </div>
          <div class="trade_order_tab" v-if="activeFinanceTab == 2">
            <Order :from="'trade'" />
          </div>

        </div>
      </Tab>
    </Tabs>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import CryptoOrderList from "../assets/page/components/CryptoOrderList.vue";
import AIOrderList from "../assets/page/components/AIOrderList.vue";
import { useI18n } from "vue-i18n";
import { Tabs, Tab } from "vant";
import CopyOrders from "../Home/components/CopyOrders.vue";
import PledgeOrder from "@/views/Finance/components/PledgeOrder.vue";
import Order from "@/views/Finance/components/Order.vue";
import SpotOrderList from "../assets/page/components/SpotOrderList.vue";
import store from "@/store";

const { t } = useI18n();
const activeTab = ref(0);
const activeFinanceTab = ref(0);
const tradeOrderTab = computed(() => store.state.tradeTypeTab)
const activeMainTab = ref(Number(tradeOrderTab.value) + 1);
const IPOStockRef = ref();

const onChange = () => { };

const changeActiveTab = (val) => {
  activeTab.value = val;
};

const changeActiveTab1 = (val) => {
  activeFinanceTab.value = val;
  if (val == 3) {
    setTimeout(() => {
      IPOStockRef.value && IPOStockRef.value.init();
    }, 0);
  }
};

watch(tradeOrderTab, (val) => {
  activeMainTab.value = val + 1
})

</script>
<style lang="less">
.trade_order_container {
  width: 100%;

  .order-tab {
    position: relative;
    width: 100%;
  }

  .trade_head_tabs {
    >.van-tabs__wrap {
      height: 0.92rem;
      border-bottom: 0px !important;

      >.van-tabs__nav {
        background: none;

        >.van-tab {
          padding: 0 0.2rem;
          position: relative;
          z-index: 11;

          .van-tab__text {
            font-size: 0.32rem;
            color: var(--ex-text-color3);
          }
        }

        >.van-tab--active {
          .van-tab__text {
            font-size: 0.4rem;
            font-weight: 600;
            color: var(--ex-text-color);
          }
        }

        >.van-tabs__line {
          display: none;
        }
      }
    }
  }

  .trade_order_tab {
    height: 80vh;
    overflow-y: auto;

    .page_ipo_stock {
      padding: 0;
    }


    .tabs {
      padding: 0 !important;
    }
  }

  .trade_order_tab2 {
    height: calc(80vh + 0.96rem)
  }
}
</style>
