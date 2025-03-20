<template>
  <div class="w-full h-full">
    <div class="page-trade3" :style="{ paddingBottom: props.innerPage ? '0' : '' }">


      <!-- 作为完整页面的菜单 -->
      <HeaderTabs :type="'custom-line'" @change="changeTab" v-model:active="headActiveTab"
        :tabs="[t('home.optional'), t('market.market_item_detail')]">
        <template #after>
          <div class="flex items-center gap-[0.16rem] mr-[0.3rem]">
            <div class="size-[0.72rem]" @click="jump('search')"
              style="background-color: var(--ex-bg-white1);border-radius: 50%;padding: 0.12rem;">
              <img class="img transition" v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="" />
            </div>
            <div class="size-[0.72rem]" @click="openRightMenu"
              style="background-color: var(--ex-bg-white1);border-radius: 50%;padding: 0.12rem;"
              :style="{ border: showRightMenu ? '1px solid var(--ex-primary-color)' : '' }">
              <img class="img transition" v-lazy="getStaticImgUrl('/static/img/common/right_menu.svg')" alt="" />
            </div>
          </div>
        </template>
      </HeaderTabs>

      <div style="height: 0.32rem;"></div>
      <!-- 自选 -->
      <div v-if="headActiveTab == 0">
        <div :class="['home-tab-box-' + props.from]" :style="{ borderTop: '1px solid var(--ex-border-color)' }">
          <div v-if="token">
            <Loaidng v-if="watchListLoading" :loading="watchListLoading" />
            <div style="padding-bottom: 0.2rem;overflow: visible;" v-if="headActiveTab == 0 && !watchListLoading">
              <StockItem :handleClick="() => checkGoTrade(item)" :padding="true" :showIcon="true" :item=item
                v-for="(item, i) in (watchList)" :key="'c_' + i" menuType="option" marketType="crypto" />
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

      <div v-if="headActiveTab == 1">
        <Recommend @handleClick="handleClick" :innerPage="props.innerPage" v-if="activated" ref="recommendRef"
          from="trade" :sticky="false" :activated="activated" />
      </div>

    </div>
  </div>


  <CheckJump ref="CheckJumpRef" />
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
import { useRoute } from "vue-router";
import CheckJump from "@/components/CheckJump.vue"

const route = useRoute();
const emits = defineEmits(['handleClick'])
const props = defineProps({
  innerPage: {
    type: Boolean,
    default: false
  }
})

// 检测并跳转
const CheckJumpRef = ref();
const checkGoTrade = item => {
  CheckJumpRef.value && CheckJumpRef.value.check(item)
}

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
watch(route, (val) => {
  if (val.name == "trade" && val.query.marketType) {
    switch (val.query.marketType) {
      case 'optional':
        changeTab(0)
        break
      case 'spot':
      case 'futures':
      case 'ai':
        changeTab(1)
        break
    }
  }
}, { immediate: true })


const jump = name => router.push(name)
const { t } = useI18n();
const searchList = computed(() => store.state.searchList)
const searchRef = ref('')
const { startSocket } = useSocket();
// 订阅 
const subs = () => {
  store.commit("setMarketWatchKeysByPage");
  store.dispatch("subList", {});
};

let timeout = null

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