<!-- 交易页 -->
<template>
  <div>
    <!-- 头部 -->
    <HeaderTabs
      :type="'custom-line'"
      :from="'trade'"
      v-model:active="headActiveTab"
      :tabs="[t('交易'), t('理财')]"
    >
      <template #after>
        <div class="flex gap-[0.16rem] mr-[0.3rem]">
          <div
            class="size-[0.72rem] rounded-[50%] bg-white2 flex items-center justify-center ripple-btn"
            @click="openOrderList"
          >
            <div class="size-[0.48rem]">
              <img
                v-lazy="getStaticImgUrl('static/img/common/order_menu.svg')"
                alt=""
              />
            </div>
          </div>
          <div
            class="size-[0.72rem] rounded-[50%] bg-white2 flex items-center justify-center ripple-btn"
            @click="openMenu"
          >
            <div class="size-[0.48rem]">
              <img
                v-lazy="getStaticImgUrl('static/img/common/right_menu.svg')"
                alt=""
              />
            </div>
          </div>
        </div>
      </template>
    </HeaderTabs>

    <div class="page-marketinfo2 mt-[0.32rem]" v-if="headActiveTab == 0">
      <!-- <div class="left-icon" @click="openMenu">
                <div class="w-[0.44rem] h-[0.44rem]">
                    <img v-lazy="getStaticImgUrl('/static/img/trade/trade-menu.svg')" alt="" />
                </div>
            </div> -->

      <div v-if="!item.symbol">
        <div style="height: 2rem"></div>
        <Loaidng :loading="true" />
      </div>
      <div class="market-trade-body" v-if="item.symbol && !chartLoading">
        <Tabs
          @change="changeTab2"
          :key="'main'"
          class="van-tabs--top"
          :sticky="true"
          :color="'var(--ex-primary-color)'"
          v-model:active="activeTab"
          animated
          shrink
        >
          <!-- 现货 -->
          <Tab :name="1" :title="$t('common.spot')">
            <div
              class="dialog-market-box"
              v-if="activeTab == 1 && !chartLoading"
            >
              <div class="top-box">
                <!-- 标题 -->
                <div class="title" @click="showSearchDialog = true">
                  <div class="title_name">
                    {{ item.name || '--' }}
                    <Icon name="arrow-down" />
                  </div>
                </div>
                <div style="flex: 1"></div>
                <div @click="goMaret">
                  <div class="size-[0.48rem] mr-[0.24rem]">
                    <img
                      v-lazy="getStaticImgUrl('/static/img/market/market.svg')"
                      alt=""
                    />
                  </div>
                </div>
                <!-- 详情 -->
                <div
                  class="search star"
                  @click="addCollect(activeTab)"
                  :style="{ opacity: loading ? '0.5' : '1' }"
                >
                  <div class="size-[0.48rem]">
                    <img
                      v-if="item.watchlist == 1"
                      v-lazy="getStaticImgUrl('/static/img/market/star.svg')"
                      alt=""
                    />
                    <img
                      v-else
                      v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div
                class="charts-box"
                :class="[hideChart ? 'hide-charts-box' : '']"
                v-if="!showInfoDialog"
              >
                <Chart
                  @switch="(e) => (hideChart = e)"
                  :type="'spot'"
                  :mini="true"
                />
              </div>
              <!-- 内容1 -->
              <div
                style="
                  margin: 0.1rem;
                  background-color: var(--ex-bg-color3);
                  border-radius: 0.32rem;
                "
              >
                <Tabs
                  :key="'sub'"
                  class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                  :color="'var(--ex-primary-color)'"
                  v-model:active="activeTab2"
                  animated
                  shrink
                >
                  <Tab :name="11" :title="$t('trade.stock_open')">
                    <OpeningSpot
                      :item="item"
                      ref="openingRef2"
                      :from="'trade'"
                      :type="'spot'"
                    />
                  </Tab>
                  <Tab
                    :name="22"
                    :title="$t('market.market_item_order')"
                    v-if="item.type == 'crypto'"
                  >
                    <div style="height: 0.08rem"></div>
                    <div class="market-box">
                      <OrderingSpot
                        :tradeType="'spot'"
                        v-if="activeTab2 == 22"
                        :key="'o'"
                        type="nomal"
                      />
                    </div>
                  </Tab>
                  <Tab
                    :name="33"
                    :title="$t('market.market_item_news')"
                    v-if="item.type == 'crypto'"
                  >
                    <div class="market-box">
                      <OrderingSpot
                        :tradeType="'spot'"
                        v-if="activeTab2 == 33"
                        :key="'n'"
                        type="news"
                      />
                    </div>
                  </Tab>
                  <Tab :title="t('trade.trade_orders_current')" :name="44">
                    <div style="height: 0.2rem"></div>
                    <div class="dialog-market-bg" v-if="activeTab2 == 44">
                      <PositionsSpot :type="'constract'" />
                    </div>
                  </Tab>
                  <Tab :title="t('trade.trade_order_history')" :name="55">
                    <div style="height: 0.2rem"></div>
                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                      <InquireSpot
                        :scrollDom="'.dialog-market-box'"
                        :type="'constract'"
                        ref="InquireRef"
                      />
                    </div>
                  </Tab>
                </Tabs>
              </div>
              <div style="height: 0.4rem"></div>
            </div>
          </Tab>
          <Tab :name="2" :title="$t('common.crypto')">
            <div
              class="dialog-market-box"
              v-if="activeTab == 2 && !chartLoading"
            >
              <div class="top-box">
                <!-- 标题 -->
                <div class="title" @click="showSearchDialog = true">
                  <div class="title_name">
                    {{ item.name || '--' }}
                    <Icon name="arrow-down" />
                  </div>
                </div>
                <div style="flex: 1"></div>
                <div @click="goMaret">
                  <div class="size-[0.48rem] mr-[0.24rem]">
                    <img
                      v-lazy="getStaticImgUrl('/static/img/market/market.svg')"
                      alt=""
                    />
                  </div>
                </div>
                <!-- 详情 -->
                <div
                  class="search star"
                  @click="addCollect(activeTab)"
                  :style="{ opacity: loading ? '0.5' : '1' }"
                >
                  <div class="size-[0.48rem]">
                    <img
                      v-if="item.watchlist == 1"
                      v-lazy="getStaticImgUrl('/static/img/market/star.svg')"
                      alt=""
                    />
                    <img
                      v-else
                      v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div
                class="charts-box"
                :class="[hideChart ? 'hide-charts-box' : '']"
                v-if="!showInfoDialog && !openInfoStatus"
              >
                <Chart
                  @switch="(e) => (hideChart = e)"
                  :from="'constract'"
                  :type="'constract'"
                  :mini="true"
                />
              </div>
              <!-- 内容1 -->
              <div
                style="
                  margin: 0.1rem;
                  background-color: var(--ex-bg-color3);
                  border-radius: 0.32rem;
                "
              >
                <Tabs
                  :key="'sub'"
                  class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                  :color="'var(--ex-primary-color)'"
                  v-model:active="activeTab2"
                  animated
                  shrink
                >
                  <Tab :name="11" :title="$t('trade.stock_open')">
                    <OpeningContract
                      :item="item"
                      ref="openingRef2"
                      :from="'trade'"
                      :type="'crypto'"
                    />
                  </Tab>
                  <Tab
                    :name="22"
                    :title="$t('market.market_item_order')"
                    v-if="item.type == 'crypto'"
                  >
                    <div style="height: 0.08rem"></div>
                    <div class="market-box">
                      <OrderingSpot
                        :tradeType="'crypto'"
                        v-if="activeTab2 == 22"
                        :key="'o'"
                        type="nomal"
                      />
                    </div>
                  </Tab>
                  <Tab
                    :name="33"
                    :title="$t('market.market_item_news')"
                    v-if="item.type == 'crypto'"
                  >
                    <div class="market-box">
                      <OrderingSpot
                        :tradeType="'crypto'"
                        v-if="activeTab2 == 33"
                        :key="'n'"
                        type="news"
                      />
                    </div>
                  </Tab>
                  <Tab :title="t('trade.trade_orders_current')" :name="44">
                    <div style="height: 0.2rem"></div>
                    <div class="dialog-market-bg" v-if="activeTab2 == 44">
                      <PositionsContract :type="'constract'" />
                    </div>
                  </Tab>
                  <Tab :title="t('trade.trade_order_history')" :name="55">
                    <div style="height: 0.2rem"></div>
                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                      <InquireContract
                        :scrollDom="'.dialog-market-box'"
                        :type="'constract'"
                        ref="InquireRef"
                      />
                    </div>
                  </Tab>
                </Tabs>
              </div>

              <!-- 内容2 -->
              <!-- <div style="padding: 0 0.1rem;background-color:var(--ex-bg-color);margin-top: 0.1rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab3" animated shrink>
                                <Tab :title="t('trade.trade_orders_current')" :name="44">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 44">
                                        <PositionsContract :type="'constract'" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 55">
                                        <InquireContract :scrollDom="'.dialog-market-box'" :type="'constract'" ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div> -->
              <div style="height: 0.4rem"></div>
            </div>
          </Tab>
          <Tab :name="3" :title="$t('trade.left_bot')">
            <div
              class="dialog-market-box"
              v-if="activeTab == 3 && !chartLoading"
            >
              <div class="top-box">
                <!-- 标题 -->
                <div class="title" @click="showSearchDialog = true">
                  <div class="title_name">
                    {{ item.name || '--' }}
                    <Icon name="arrow-down" />
                  </div>
                </div>
                <div style="flex: 1"></div>
                <div @click="goMaret">
                  <div class="size-[0.48rem] mr-[0.24rem]">
                    <img
                      v-lazy="getStaticImgUrl('/static/img/market/market.svg')"
                      alt=""
                    />
                  </div>
                </div>
                <!-- 详情 -->
                <div
                  class="search star"
                  @click="addCollect(activeTab)"
                  :style="{ opacity: loading ? '0.5' : '1' }"
                >
                  <div class="size-[0.48rem]">
                    <img
                      v-if="item.watchlist == 1"
                      v-lazy="getStaticImgUrl('/static/img/market/star.svg')"
                      alt=""
                    />
                    <img
                      v-else
                      v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div
                class="charts-box"
                :class="[hideChart ? 'hide-charts-box' : '']"
                v-if="!showInfoDialog"
              >
                <Chart
                  @switch="(e) => (hideChart = e)"
                  :type="'ai'"
                  :mini="true"
                />
              </div>
              <!-- 内容1 -->
              <div
                style="
                  margin: 0.1rem;
                  background-color: var(--ex-bg-color3);
                  border-radius: 0.32rem;
                "
              >
                <Tabs
                  :key="'sub'"
                  class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                  :color="'var(--ex-primary-color)'"
                  v-model:active="activeTab2"
                  animated
                  shrink
                >
                  <Tab :name="11" :title="$t('trade.stock_open')">
                    <div style="height: 0.32rem"></div>
                    <OpeningAi
                      :tradeType="'ai'"
                      ref="openingRef2"
                      :type="'ai'"
                    />
                  </Tab>
                  <Tab :title="t('trade.trade_orders_current')" :name="44">
                    <div style="height: 0.2rem"></div>
                    <div class="dialog-market-bg" v-if="activeTab2 == 44">
                      <PositionsAi />
                    </div>
                  </Tab>
                  <Tab :title="t('trade.trade_order_history')" :name="55">
                    <div style="height: 0.2rem"></div>
                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                      <InquireAi
                        :scrollDom="'.dialog-market-box'"
                        ref="InquireRef"
                      />
                    </div>
                  </Tab>
                </Tabs>
              </div>

              <div style="height: 0.4rem"></div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <!-- 搜索列表 -->
      <BottomPopup
        @opened="openedList"
        @close="closeList"
        round
        v-model:show="showSearchDialog"
        position="bottom"
        closeable
        teleport="body"
      >
        <div class="van-popup-custom-title">
          {{ titleMap[activeTab] }}
        </div>
        <div class="search_dialog_trade">
          <!-- 搜索 -->
          <div class="item search_box">
            <div class="search_icon">
              <img
                v-lazy="getStaticImgUrl('/static/img/common/search.svg')"
                alt="🔍"
              />
            </div>
            <input
              v-model.trim="searchDialogStr"
              @keyup="initTabList"
              type="text"
              class="ipt"
              style="width: 100%"
              :placeholder="t('trade.stock_opening_search')"
            />
          </div>

          <div class="lists search_dialog_list" v-if="showSearchCon">
            <StockTable
              :key="activeTab"
              :showIcon="[1, 2, 5, 6].includes(activeTab)"
              theme="classic"
              :handleClick="handleClick"
              :type="route.query.tradeType"
              :loading="false"
              :list="showList"
            />

            <LoadingMore
              :style="{ 'margin-bottom': finish ? '0.4rem' : '1.6rem' }"
              :loading="searchLoading2"
              :finish="finish"
              v-if="(finish && showList.length) || !finish"
            />
          </div>
        </div>
      </BottomPopup>

      <!-- 详情 -->
      <BottomPopup
        round
        v-model:show="showInfoDialog"
        position="bottom"
        closeable
        teleport="body"
      >
        <div
          class="page_trade_info"
          style="max-height: calc(var(--vh) * 90); overflow-y: auto"
          v-if="showInfoDialog && !openInfoStatus"
        >
          <div
            style="
              text-align: center;
              color: var(--ex-text-color);
              font-size: 0.32rem;
              padding: 0.1rem 0 0.2rem 0;
              font-weight: bold;
            "
          >
            {{ activeTab == 4 ? item.symbol : item.name }}
          </div>
          <MarketInfo2 :innerPage="true" />
        </div>
      </BottomPopup>

      <!-- 菜单 -->
      <Popup
        round
        v-model:show="showNavDialog"
        position="left"
        :style="{ width: '85%', height: '100%' }"
      >
        <Index
          @handleClick="handleClickIndex"
          ref="IndexRef"
          :innerPage="true"
        />
      </Popup>
    </div>

    <div v-if="headActiveTab == 1">
      <FinanceIndex class="mt-[0.32rem]" :from="'tradeInfo'" />
    </div>
    <BottomPopup
      round
      :show="showOrderList"
      @close="closeOrderList()"
      closeable
    >
      <div class="relative">
        <OrderCenter />
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onActivated, onDeactivated } from 'vue';
  import { Tabs, Tab, Icon, Popup } from 'vant';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import store from '@/store';
  import { getStaticImgUrl, _formatNumber } from '@/utils/index.js';
  import { _futures, _basic, _add, _del, _aiquant2, _trade } from '@/api/api';
  import BottomPopup from '@/components/BottomPopup.vue';
  import Loaidng from '@/components/Loaidng.vue';
  import router from '@/router';
  import LoadingMore from '@/components/LoadingMore.vue';
  import HeaderTabs from '@/components/HeaderTabs.vue';
  import FinanceIndex from '../Finance/Index.vue';

  // 公共
  import StockTable from '@/components/StockTable.vue';
  import OrderingSpot from '@/views/Market/OrderingSpot.vue';
  import Chart from '@/views/Market/Chart.vue';
  // 现货
  import OpeningSpot from '@/views/Trade2/spot/Opening.vue';
  import PositionsSpot from '@/views/Trade2/spot/Positions.vue';
  import InquireSpot from '@/views/Trade2/spot/Inquire.vue';
  // 合约
  import OpeningContract from '@/views/Trade2/contract/Opening.vue';
  import PositionsContract from '@/views/Trade2/contract/Positions.vue';
  import InquireContract from '@/views/Trade2/contract/Inquire.vue';
  // 交易机器人
  import OpeningAi from '@/views/Trade2/ai/Opening.vue';
  import PositionsAi from '@/views/Trade2/ai/Positions.vue';
  import InquireAi from '@/views/Trade2/ai/Inquire.vue';
  // 详情
  import MarketInfo2 from '@/views/Market/MarketInfo2.vue';
  // 导航
  import Index from './Index.vue';
  import StockPopup from '../trade/StockPopup.vue';
  import OrderCenter from './OrderCenter.vue';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
  });

  const headActiveTab = ref(Number(sessionStorage.getItem('tradeType')));
  const openInfoStatus = computed(() => store.state.openInfoStatus);
  const showOrderList = computed(() => store.state.showOrderList);

  const { t } = useI18n();
  const route = useRoute();
  const token = computed(() => store.state.token);

  // 详情弹窗
  const showInfoDialog = ref(false);
  const goMaret = () => {
    showInfoDialog.value = true;
  };
  const titleMap = ref({
    1: '现货',
    2: '合约',
    3: '交易机器人',
  });
  // 分类
  const activeTab = ref(1); // 一级
  if (route.query.tradeType == 'constract') {
    activeTab.value = 2;
  } else if (route.query.tradeType == 'ai') {
    activeTab.value = 3;
  } else {
    if (sessionStorage.getItem('tradeinfo-tab')) {
      activeTab.value = Number(sessionStorage.getItem('tradeinfo-tab'));
    }
  }
  const activeTab2 = ref(11); // 二级
  const hideChart = ref(false); // 折叠图表

  const tradeTypeMap = {
    1: 'spot',
    2: 'constract',
    3: 'ai',
    4: 'stock',
    5: 'foreign',
    6: 'commodities',
  };

  const changeTab = (val) => {
    // store.commit("setTradeTabType", val);
    sessionStorage.setItem('tradeType', val);
    headActiveTab.value = val;
  };

  const openOrderList = () => {
    setTimeout(() => {
      store.commit('setShowOrderList', true);
    }, 50);
  };

  const closeOrderList = () => {
    store.commit('setShowOrderList', false);
  };

  const changeTab2 = (e) => {
    searchDialogStr.value = '';
    hideChart.value = false;
    activeTab.value = e;
    activeTab2.value = 11;
    sessionStorage.setItem('tradeinfo-tab', e);
    setTimeout(() => {
      router.replace({
        name: 'tradeInfo',
        query: {
          symbol: item.value.symbol,
          type: tradeTypeMap[e] == 'spot' ? 'constract' : tradeTypeMap[e],
          tradeType: tradeTypeMap[e],
        },
      });
      initTabList();
    }, 100);
  };

  // 股票信息
  const item = computed(() => {
    let it = {};
    switch (activeTab.value) {
      case 1: // 现货
        it = store.state.currSpot || {};
        break;
      case 2: // 合约
        it = store.state.currConstact || {};
        break;
      case 3: // ai
        it = store.state.currAi || {};
        break;
    }
    return it;
  });

  const updown = computed(() => {
    // 1-涨 -1-跌 0-平
    if (item.value.ratio === undefined) return 0;
    return item.value.ratio > 0 ? 1 : -1;
  });

  // 获取股票最新信息
  const getBasic = (obj, tab) => {
    _basic({ symbol: obj.symbol }).then((res) => {
      if (res.code == 200) {
        if (res.data.symbol == item.value.symbol) {
          switch (tab) {
            case 1: // 现货
              store.commit('setCurrSpot', {
                ...obj,
                ...res.data,
              });
              break;
            case 2: // 合约
              store.commit('setCurrConstract', {
                ...obj,
                ...res.data,
              });
              break;
            case 3: // ai
              store.commit('setCurrAi', {
                ...obj,
                ...res.data,
              });
              break;
          }
        }
      }
    });
  };
  if (item.value.symbol) {
    getBasic(item.value, activeTab.value);
  }
  const chartLoading = ref(true);
  onMounted(() => {
    setTimeout(() => {
      chartLoading.value = false;
    }, 500);
  });
  const handleClick = (obj) => {
    obj = JSON.parse(JSON.stringify(obj));
    showSearchDialog.value = false;
    chartLoading.value = true;
    if (activeTab.value == 1) {
      store.commit('setCurrSpot', obj);
    }
    if (activeTab.value == 2) {
      store.commit('setCurrConstract', obj);
    }
    if (activeTab.value == 3) {
      store.commit('setCurrAi', obj);
    }
    setTimeout(() => {
      router.replace({
        name: 'tradeInfo',
        query: {
          symbol: obj.symbol,
          type:
            tradeTypeMap[activeTab.value] == 'spot'
              ? 'constract'
              : tradeTypeMap[activeTab.value],
          tradeType: tradeTypeMap[activeTab.value],
        },
      });
    }, 100);
    setTimeout(() => {
      getBasic(obj, activeTab.value);
      chartLoading.value = false;
    }, 200);
  };
  const handleClickIndex = ({ item, type }) => {
    if (type) {
      switch (type) {
        case 'spot':
          activeTab.value = 1;
          break;
        case 'constract':
          activeTab.value = 2;
          break;
        case 'ai':
          activeTab.value = 3;
          break;
      }
    }
    setTimeout(() => {
      handleClick(item);
      showNavDialog.value = false;
    }, 300);
  };

  // 添加自选
  const loading = ref(false);
  const addCollect = (tab) => {
    if (!token.value) return store.commit('setIsLoginOpen', true);
    if (loading.value) return;
    loading.value = true;
    if (!item.value.watchlist) {
      _add({
        symbol: item.value.symbol,
      })
        .then((res) => {
          if (res.code == 200) {
            store.dispatch('updateMarketWatchList');
            switch (tab) {
              case 1: // 现货
              case 2: // 合约
                store.commit('setCurrConstract', { watchlist: 1 });
                break;
              case 3: // ai
                store.commit('setCurrAi', { watchlist: 1 });
                break;
            }
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
            switch (tab) {
              case 1: // 现货
              case 2: // 合约
                store.commit('setCurrConstract', { watchlist: 0 });
                break;
              case 3: // ai
                store.commit('setCurrAi', { watchlist: 0 });
                break;
            }
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  // 搜索
  const showList = computed(() => {
    switch (activeTab.value) {
      case 1: // 现货
        return spotList.value;
      case 3: // ai
        return marketAiList.value;
      default:
        return contractList.value;
    }
  });
  // 订阅
  const subs = () => {
    setTimeout(() => {
      store.dispatch('subList', {
        allKeys: showList.value.map((item) => item.symbol),
      });
    }, 500);
  };
  subs();
  // 列表数据
  const spotList = computed(() => store.state.spotList || []); // 现货列表
  const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
  const contractList = computed(() => store.state.contractList || []); // 现货/合约
  // 初始化列表数据
  const searchLoading2 = ref(false);
  const showSearchDialog = ref(false);
  const showSearchCon = ref(false);
  watch(
    () => showSearchDialog.value,
    (val) => {
      if (val) {
        showSearchCon.value = val;
      } else {
        setTimeout(() => {
          showSearchCon.value = val;
        }, 300);
      }
    },
  );
  const searchDialogStr = ref('');
  let searhTimeout = null;
  const page = ref(1);
  const finish = ref(false);
  const handleData = (res, more, tab) => {
    let arr = [];
    if (more === true) {
      arr = [...showList.value, ...res.data];
      if (!res.data || !res.data.length) {
        finish.value = true;
      }
    } else {
      arr = (res.data || []).map((item) => {
        const target = showList.value.find((a) => a.symbol == item.symbol);
        if (target)
          return {
            ...target,
            ...item,
          };
        return item;
      });
    }
    switch (tab) {
      case 1:
        store.commit('setSpotList', arr);
        break;
      case 2:
        store.commit('setContractList', arr);
        break;
      case 3:
        arr = arr.map((item) => {
          item.tradeType = 'ai';
          return item;
        });
        store.commit('setMarketAiList', arr);
        break;
    }

    // 这里如果当前没有item的值 就设置下
    if (!item.value.symbol) {
      const obj = arr[0];
      switch (activeTab.value) {
        case 1:
          store.commit('setCurrSpot', obj || {});
          break;
        case 2:
          store.commit('setCurrConstract', obj || {});
          break;
        case 3:
          store.commit('setCurrAi', obj || {});
          break;
      }
    }
    subs();
  };
  const initTabList = (more) => {
    if (searhTimeout) clearTimeout(searhTimeout);
    searhTimeout = setTimeout(() => {
      searchLoading2.value = true;
      if (more === true) {
        page.value++;
      } else {
        page.value = 1;
        finish.value = false;
      }
      const tab = activeTab.value;
      if (activeTab.value == 3) {
        // ai
        _aiquant2({
          type: '',
          name: searchDialogStr.value,
          page: page.value,
        })
          .then((res) => {
            handleData(res, more, tab);
          })
          .finally(() => {
            searchLoading2.value = false;
          });
      } else if (activeTab.value == 1) {
        // 现货
        _trade({
          name: searchDialogStr.value,
          page: page.value,
        })
          .then((res) => {
            handleData(res, more, tab);
          })
          .finally(() => {
            searchLoading2.value = false;
          });
      } else {
        // 合约下分类
        let type = '';
        switch (tab) {
          case 2:
            type = 'crypto';
            break;
        }
        _futures({
          name: searchDialogStr.value,
          type: type,
          page: page.value,
        })
          .then((res) => {
            handleData(res, more, tab);
          })
          .finally(() => {
            searchLoading2.value = false;
          });
      }
    }, 600);
  };
  setTimeout(() => {
    initTabList();
  }, 0);
  // 搜索更多数据
  const loadMore = () => {
    if (searchLoading2.value || finish.value) return;
    initTabList(true);
  };
  let moreDom = null;
  const totalHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect();
    if (rect.top <= totalHeight) {
      // 加载更多
      loadMore();
    }
  };
  const openedList = () => {
    setTimeout(() => {
      try {
        moreDom = document.querySelector('.loading_more');
        document
          .querySelector('.search_dialog_list')
          .addEventListener('scroll', scrolHandle);
      } catch {}
    }, 500);
  };
  const closeList = () => {
    try {
      document
        .querySelector('.search_dialog_list')
        .removeEventListener('scroll', scrolHandle);
    } catch {}
  };

  //打开菜单弹窗
  const showRightMenu = computed(() => store.state.showRightMenu);
  const openRightMenu = () => {
    // rightMenu.value = true
    store.commit('setShowRightMenu', !showRightMenu.value);
  };
  // 侧边弹框
  const showNavDialog = ref(false);
  const IndexRef = ref();
  const openMenu = () => {
    showNavDialog.value = true;
    setTimeout(() => {
      IndexRef.value && IndexRef.value.act();
    }, 0);
  };

  onActivated(() => {
    setTimeout(() => {
      chartLoading.value = false;
    }, 500);

    if (!route.query.tradeType) {
      router.replace({
        name: 'tradeInfo',
        query: {
          tradeType: {
            1: 'spot',
            2: 'constract',
            3: 'ai',
          }[activeTab.value],
        },
      });
    }
  });
  onDeactivated(() => {
    chartLoading.value = true;
  });
  watch(() => store.state.isLoginOpen, (v) => {
  if (v) {
    closeOrderList()
  }
})
</script>

<style lang="less" scoped>
  .search_dialog_trade {
      .lists {
          height: calc(var(--vh) * 60);
          overflow-y: auto;
          margin-top: 0.32rem;
      }

      .search_box {
          height: 1rem;
          padding: 0 0.32rem;
          margin: 0.4rem 0.3rem 0 0.3rem;
          display: flex;
          align-items: center;
          background-color: var(--ex-bg-white1);
          border-radius: 0.6rem;
          // border: 1px solid var(--ex-border-color2);

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

      .right-icon {
          position: absolute;
          right: 0.32rem;
          top: 0.24rem;
          z-index: 99;
      }

      .left-icon {
          height: 0.88rem;
          display: flex;
          align-items: center;
          position: absolute;
          left: 0.2rem;
          top: 0rem;
          z-index: 99;
      }


      .market-trade-body {

        :deep(.van-tabs--top) {
              .van-sticky {
                  .van-tabs__wrap {
                    height: 0.64rem;
                    .van-tabs__nav {
                      height: 0.64;
                      display: flex;
                      align-items: start;
                      overflow: visible;

                      .van-tab {
                        position: relative;
                        .van-tab__text {
                          font-size: 0.32rem;
                          line-height: 0.4rem;
                        }
                      }

                      .van-tab--active {
                        height: 100%;
                        display: flex;
                        align-items: start;
                        .van-tab__text {
                          font-size: 0.4rem;
                          font-weight: 600;
                        }
                        &::after {
                          content: '';
                          position: absolute;
                          width: 0.52rem;
                          height: 0.18rem;
                          bottom: 0;
                          left: 50%;
                          transform: translateX(-50%);
                          background-image: url('static/img/common/active_tab.svg');
                        }
                      }
                    }
                  }
              }
          }

          .dialog-market-box {
              margin-top: 0.1rem;
              height: calc(var(--vh) * 100 - 1rem);
              overflow-y: auto;
              padding-bottom: 1rem;

              :deep(.van-tabs--market2) {
                  &>.van-tabs__wrap {
                      border-bottom: 1px solid var(--ex-border-color4);

                      .van-tabs__nav {
                          background: var(--ex-none);

                          .van-tab {
                              span {
                                  font-size: 0.32rem;
                              }
                          }
                      }
                  }
              }

              .top-box {
                  border-radius: 0.32rem;
                  background-color: var(--ex-bg-color3);
                  margin: 0.1rem;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 0 0.28rem;
                  height: 0.96rem;
              }

              .charts-box {
                  padding: 0 0.1rem;
                  height: 5rem;
              }

              .hide-charts-box {
                  height: 1rem;
              }

              .dialog-market-bg {
                  background-color: var(--ex-bg-color3);
                  border-radius: 0.32rem;
                  padding: 0 0.24rem 0.24rem 0.24rem;
              }
          }
      }











      .bottom-box {
          margin-top: 0.32rem;
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
      }

      .market-box {
          margin-top: 0.1rem;
          height: calc(var(--vh) * 100 - 6rem) // border-radius: 0.32rem;
              // background-color: var(--ex-bg-color3);
      }


      .has_padding_x {
          padding: 0 0.3rem;
      }

  }
</style>
