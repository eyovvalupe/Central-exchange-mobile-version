<template>
  <div class="w-full h-full">
    <div class="page-trade3" :style="{ paddingBottom: props.innerPage ? '0' : '' }">

      <!-- 作为内页的菜单 -->
      <div class="z-[1]  pt-[0.4rem] pb-[0.4rem] bg-color" v-if="props.innerPage">
        <div
          class="transition flex justify-between  px-[0.32rem] py-[0.18rem] rounded-[1rem] gap-[0.2rem] h-[0.8rem] mx-[0.4rem] items-center border-[0.02rem]"
          :class="focusRef ? 'border-white' : ''" style="background-color: var(--ex-bg-white1);">
          <div class="w-[0.5rem] h-[0.5rem]">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="">
          </div>
          <div class="text-[0.32rem] text-color2 leading-[0.5rem]  flex-1 px-[0.1rem]">
            <input style="flex:1;width: 100%;" v-model.trim="searchRef" class="text-white"
              :placeholder="$t('market.market_input_crypto_set')" @input="inputHandle" @focus="focusRef = true"
              @blur="focusRef = false" />
          </div>
        </div>
      </div>

      <!-- 作为完整页面的菜单 -->
      <HeaderTabs v-else @change="changeTab" v-model:active="headActiveTab" :tabs="[t('自选'), t('行情')]">
        <template #after>
          <div class="flex items-center gap-[0.16rem] mr-[0.34rem]">
            <div class="size-[0.64rem]" @click="jump('search')"
              style="background-color: var(--ex-bg-white1);border-radius: 50%;padding: 0.12rem;">
              <img class="img transition" v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="" />
            </div>
            <div class="size-[0.64rem]" @click="openRightMenu"
              style="background-color: var(--ex-bg-white1);border-radius: 50%;padding: 0.12rem;"
              :style="{ border: showRightMenu ? '1px solid var(--ex-primary-color)' : '' }">
              <img class="img transition" v-lazy="getStaticImgUrl('/static/img/common/right_menu.svg')" alt="" />
            </div>
          </div>
        </template>
      </HeaderTabs>


      <!-- 自选 -->
      <div v-if="headActiveTab == 0 && !props.innerPage">
        <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
          :style="{ borderTop: '1px solid var(--ex-border-color)' }">
          <div v-if="token">
            <Loaidng v-if="watchListLoading" :loading="watchListLoading" />
            <div style="padding-bottom: 0.2rem;overflow: visible;" v-if="headActiveTab == 0 && !watchListLoading">
              <StockItem :padding="true" :showIcon="true" :item=item v-for="(item, i) in (watchList)" :key="'c_' + i"
                menuType="option" marketType="crypto" />
            </div>
            <NoData v-if="!watchListLoading && !watchList.length" />
          </div>
          <div v-if="!token" class="flex flex-col pt-[0.32rem] pb-[0.32rem]">


            <div
              class="w-full flex justify-between border-b-[0.02rem] pb-[0.2rem] mb-[0.6rem] px-[0.32rem] border-b-color2">
              <div class="text-color2">{{ $t('copy.copy_order_name') }}</div>
              <div class="text-color2">{{ $t('market.market_optional_crypto_price') + ' / ' +
                $t('copy.copy_belong_pl_rate') }}</div>
            </div>

            <div style="width: 100%;text-align: center;margin: 0.6rem 0 0.4rem 0;color: var(--ex-placeholder-color);">
              <div style="width:1.12rem;height:1.12rem;margin: 0 auto 0.2rem auto;">
                <img v-lazy="getStaticImgUrl('/static/img/user/unlogin-user.png')" alt="">
              </div>
              <div>{{ $t('market.market_login_first') }}</div>
            </div>
            <div class="flex justify-center gap-[0.4rem]">
              <div style="min-width: 2rem;"
                class="px-[0.28rem] h-[0.8rem] rounded-[0.4rem] bg-[var(--ex-bg-white1)] flex items-center justify-center text-[0.32rem] text-white ripple-primary"
                @click="store.commit('setIsLoginOpen', true)">{{ $t('trade.stock_opening_token_login') }}</div>
              <!-- <div class="w-[3rem] h-[0.8rem] rounded-[0.4rem] bg-primary flex items-center justify-center text-[0.32rem] text-white ripple-btn"
                                @click="jump('register')">{{ $t('trade.stock_opening_token_register') }}</div> -->
            </div>
          </div>
        </div>
      </div>

      <div v-if="headActiveTab == 1 && !focusRef && !searchRef">
        <Recommend @handleClick="handleClick" :innerPage="props.innerPage" v-if="activated" ref="recommendRef"
          from="trade" :sticky="false" :activated="activated" />
      </div>

      <div v-if="focusRef || searchRef">
        <div class=" pl-[0.38rem] pr-[0.32rem] text-[0.28rem] leading-[0.4rem]  pb-[0.08rem]"
          style="border-bottom: 1px solid var(--ex-border-color5);color:var(--ex-text-color2)">搜索结果</div>
        <div class="lists" style=" 
    border-radius: 0.32rem;
    margin-left: 0.32rem;
    margin-right: 0.32rem;
    padding-left: 0;
    padding-right: 0;">
          <StockTable :from="'trade'" :showIcon="true" theme="classic" :handleClick="goInfo" :loading="searchLoading"
            :key="'search'" :list="searchList" />
        </div>
      </div>
    </div>
  </div>

  <!-- 搜索列表 -->
  <BottomPopup round v-model:show="showSearchDialog" position="bottom" closeable teleport="body">
    <div class="van-popup-custom-title">
      {{ recommendRef.activeTab == 0 ? $t('common.spot') : $t('common.crypto') }}{{ t("trade.stock_opening_search") }}
    </div>
    <div class="search_dialog_trade">
      <!-- 搜索 -->
      <div class="item search_box">
        <div class="search_icon">
          <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
        </div>
        <input v-model.trim="searchDialogStr" @keyup="goDialogSearch" type="text" class="ipt" style="width: 100%"
          :placeholder="t('trade.stock_opening_search')" />
      </div>

      <div class="lists">
        <StockTable :from="'trade'" :showIcon="true" theme="classic" :handleClick="goInfo" :loading="searchLoading"
          :key="'search'" :list="marketSearchList" />
      </div>
    </div>
  </BottomPopup>
</template>

<script setup>
import Recommend from "@/views/Home/Homes/Recommend.vue"
import { ref, onActivated, onDeactivated, computed, onMounted, onUnmounted } from "vue"
import { useSocket } from "@/utils/ws";
import store from "@/store"
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import BottomPopup from "@/components/BottomPopup.vue";
import StockTable from "@/components/StockTable.vue";
import { _futures, _watchlist } from "@/api/api";
import { useI18n } from "vue-i18n";
import NoData from "@/components/NoData.vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import Loaidng from "@/components/Loaidng.vue";
import StockItem from "@/components/StockItem.vue";

const emits = defineEmits(['handleClick'])
const props = defineProps({
  innerPage: {
    type: Boolean,
    default: false
  }
})

const token = computed(() => store.state.token);
const headActiveTab = ref(Number(sessionStorage.getItem("tradeMarketType")));
const changeTab = (val) => {
  sessionStorage.setItem('tradeMarketType', val);
  headActiveTab.value = val;
  if (val == 0) {
    init()
  }
};
if (props.innerPage || !token.value) {
  headActiveTab.value = 1
}


const jump = name => router.push(name)
const { t } = useI18n();
const focusRef = ref(false)
const searchList = computed(() => store.state.searchList)
const contractList = computed(() => store.state.contractList)
const searchRef = ref('')
const { startSocket } = useSocket();
// 订阅 
const subs = () => {
  store.commit("setMarketWatchKeysByPage");
  store.dispatch("subList", {});
};

let timeout = null
const inputHandle = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    if (searchRef.value) goSearch()
  }, 600);
}

const goSearch = () => {
  if (!searchRef.value) return;
  if (searchLoading.value) return;
  searchList.value = [];
  searchLoading.value = true;
  _futures({
    type: '',
    name: searchRef.value
  })
    .then(res => {
      store.commit('setSearchList', res.data)
      store.dispatch('subList', {
        listKey: 'searchList'
      })
    })
    .finally(() => searchLoading.value = false);
}

const activated = ref(false);
const act = () => {
  store.commit("setMarketWatchKeys", []);
  setTimeout(() => {
    activated.value = true;
  }, 300)
  subs();
}
const unact = () => {
  activated.value = false;
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit("realtime", ""); // 价格变化
    socket && socket.emit("snapshot", ""); // 快照数据
    socket && socket.off("realtime");
    socket && socket.off("snapshot");
  });
}
onActivated(() => {
  act()
});
onDeactivated(() => {
  unact()
});
onUnmounted(() => {
  unact()
})

const handleClick = (obj) => { // 如果作为侧窗点击元素
  emits('handleClick', obj)
}

const recommendRef = ref()
const goInfo = (item) => { // 作为页面点击元素
  if (props.innerPage) return handleClick({ item: item })
  showSearchDialog.value = false
  store.commit("setCurrConstract", item);
  router.push({
    name: "market_info",
    query: {
      symbol: item.name,
      type: "constract",
      tradeType: recommendRef.value && recommendRef.value.activeTab == 0 ? 'spot' : 'constract'
    },
  });
};


// 右侧弹窗
const showRightMenu = computed(() => store.state.showRightMenu);
const openRightMenu = () => {
  store.commit("setShowRightMenu", !showRightMenu.value);
};

// 搜索
const marketSearchList = computed(() => store.state.futuresSearchList)
const showSearchDialog = ref(false);
const searchDialogStr = ref("");
let searchTimeout = null;
const searchLoading = ref(false);
const goDialogSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchLoading.value = true;
  let s = searchDialogStr.value;
  searchTimeout = setTimeout(() => {
    _futures({
      name: s,
      type: "",
    })
      .then((res) => {
        if (searchDialogStr.value == s) {
          let arr = (res.data || []).map((item) => {
            const target = marketSearchList.value.find(
              (a) => a.symbol == item.symbol
            );
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit("setFuturesSearchList", arr);
          store.dispatch("subList", {
            commitKey: "setFuturesSearchList",
            listKey: "futuresSearchList",
          });
        }
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }, 100);
};
setTimeout(() => {
  goDialogSearch()
}, 2000)

// watch(searchRef, (val) => {
//   if (!val) {
//     setTimeout(() => {
//       store.commit('setSearchList', [])
//     }, 100);
//   }
// })

// 订阅的数据

const watchList = computed(() => store.state.marketWatchList || []);
const watchListLoading = ref(false);
const getWatchList = () => {
  if (watchListLoading.value) return;
  watchListLoading.value = true;
  _watchlist()
    .then(res => {
      if (res.code == 200) {
        const list = res.data.map(item => {
          const target = watchList.value.find(a => a.symbol == item.symbol)
          if (target) return target;
          return item;
        })
        store.commit("setMarketWatchList", list || []);
        sessionStorage.setItem('market_watch_list', JSON.stringify(list || []))
        setTimeout(() => {
          store.dispatch('subList', {
            commitKey: 'setMarketWatchList',
            listKey: 'marketWatchList'
          })
        }, 50);
      }
    })
    .catch(err => console.error(err))
    .finally(() => watchListLoading.value = false);
}

const init = () => {
  if (token.value) getWatchList();
}

init()

defineExpose({
  act
})
</script>

<style lang="less" scoped>
.search_dialog_trade {
  .lists {
    height: calc(var(--vh) * 60) !important;
    overflow-y: auto;
    margin-top: 0.32rem;
  }

  .search_box {
    height: 0.8rem;
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


.page-trade3 {
  width: 100%;
  height: 100%;
  padding: 0 0 1.4rem 0;
  overflow-y: auto;
  position: relative;
  background-color: var(--ex-bg-color);

  .lists {
    height: calc(var(--vh) * 100 - 2.5rem);
    overflow-y: auto;
    margin-top: 0.32rem;
    padding: 0 0.32rem;
  }

  .transition {
    transition: all 0.3s ease-in;
  }

  .search-bg {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 1.34rem;
    padding: 0.16rem 0.32rem 0 0.32rem;
    z-index: 999;
    // background-color: var(--ex-bg-color5);

    .bill-box {
      width: 0.64rem;
      height: 0.64rem;
      border-radius: 50%;
      background-color: var(--ex-bg-color2);
      position: absolute;
      right: 0.32rem;
      padding: 0.16rem;
      top: 1.32rem;
    }
  }

  .search-box {
    height: 0.92rem;
    border-radius: 0.92rem;
    background-color: var(--ex-bg-color5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.3rem;

    .search-icon {
      width: 0.32rem;
      height: 0.32rem;
      margin-right: 0.3rem;
    }

    .ipt {
      height: 100%;
      flex: 1;
      align-items: center;
      display: flex;
      justify-content: flex-start;
      color: var(--ex-placeholder-color);
    }
  }
}
</style>