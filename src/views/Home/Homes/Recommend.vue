<template>
    <div class="home-tabs-box"
        :class="['home-tabs-box-' + props.from, 'home-tabs-box-' + (props.innerPage ? 'inner' : '')]">
        <Tabs :type="from == 'trade' ? '' : 'sub'" :class="[from == 'trade' ? 'van-tabs--top' : '']"
            :color="'var(--ex-primary-color)'" @change="tabChange" v-if="props.activated" v-model:active="activeTab"
            :animated="from != 'home'" shrink>
            <Tab :name="1" :title="t('common.spot')">
                <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: '1px solid var(--ex-border-color)' }" v-if="activeTab == 1">
                    <div class="" style="padding-bottom: 0.2rem;overflow: visible;">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="{ ...item, type: 'spot' }" v-for="(item, i) in filterList(showList)"
                            :key="'c_' + i" menuType="spot" marketType="spot" page="home" />
                    </div>
                </div>
            </Tab>
            <Tab :name="2" :title="$t('common.crypto')">
                <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: '1px solid var(--ex-border-color)' }" v-if="activeTab == 2">
                    <div style="padding-bottom: 0.2rem;">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="item" v-for="(item, i) in filterList(showList)" :key="'c_' + i"
                            menuType="constract" marketType="crypto" page="home" />
                    </div>
                </div>
            </Tab>
            <Tab :name="3" :title="$t('common.option')">
                <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: '1px solid var(--ex-border-color)' }" v-if="activeTab == 3">
                    <div style="padding-bottom: 0.2rem;">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="false" :item="item" v-for="(item, i) in filterList(showList)" :key="'c_' + i"
                            menuType="ai" marketType="ai" page="home" />
                    </div>
                </div>
            </Tab>
        </Tabs>
        <LoadingMore :classN="'trade-more'" :style="{ 'margin-bottom': finish ? '0.4rem' : '1.6rem' }"
            :loading="searchLoading2" :finish="finish" v-if="(finish && showList.length) || !finish" />
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue"
import StockItem from "@/components/StockItem.vue";
import { _futures, _stock, _watchlist, _trade, _aiquant2 } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";
import router from "@/router";
import LoadingMore from "@/components/LoadingMore.vue";
import { useRoute } from "vue-router"

const route = useRoute()
const emits = defineEmits(['handleClick'])
const handleClick = (item, type) => {
    console.error(item, type)
    emits('handleClick', {
        item,
        type,
    })
}

const { t } = useI18n();
const token = computed(() => store.state.token);

const props = defineProps({
    activated: false,
    sticky: false,
    from: '',
    innerPage: {
        type: Boolean,
        default: false
    }
})

const activeTab = ref(1);
const setTab = () => {
    if (!token.value) {
        activeTab.value = 1
    }
    if (route.query.marketType == 'spot') {
        activeTab.value = 1
    }
    else if (route.query.marketType == 'futures') {
        activeTab.value = 2
    }
    else if (route.query.marketType == 'ai') {
        activeTab.value = 3
    }
}
setTab()
if (sessionStorage.getItem(`rec_tab_${props.from}`)) {
    activeTab.value = Number(sessionStorage.getItem(`rec_tab_${props.from}`))
}
setTimeout(() => {
    tabChange(activeTab.value)
}, 0)

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
        case 4: // etf
            it = store.state.currAi || {}
            break
    }
    return it;
});


const jump = (val) => {
    router.push({
        name: val
    })
}

const tabChange = (val) => {
    // 缓存
    sessionStorage.setItem(`rec_tab_${props.from}`, val)
    setTimeout(() => {
        initTabList()
    }, 100)
};


// 获取推荐数据
const spotList = computed(() => store.state.spotList || []); // 现货列表
const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
const contractList = computed(() => store.state.contractList || []); // 现货/合约
// 搜索
const showList = computed(() => {
    switch (activeTab.value) {
        case 1:
            return spotList.value
        case 2:
            return contractList.value
        case 3: // ai
            return marketAiList.value
        case 4:
            return marketAiList.value
        default:
            return []
    }
});
// 订阅
const subs = () => {
    setTimeout(() => {
        store.dispatch("subList", {
            allKeys: showList.value.map(item => item.symbol)
        });
    }, 500)
}
subs()

// 列表数据
const searchLoading2 = ref(false);
const page = ref(1)
const finish = ref(false)
const handleData = (res, more, tab) => {
    let arr = []
    if (more === true) {
        arr = [
            ...showList.value,
            ...res.data
        ]
        if (!res.data || !res.data.length) {
            finish.value = true
        }
    } else {
        arr = (res.data || []).map((item) => {
            const target = showList.value.find(
                (a) => a.symbol == item.symbol,
            );
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
            store.commit("setSpotList", arr);
            break;
        case 2:
            store.commit("setContractList", arr);
            break;
        case 3:
        case 4:
            arr = arr.map(item => {
                item.tradeType = 'ai'
                return item
            })
            store.commit("setMarketAiList", arr);
            break;
    }

    // 这里如果当前没有item的值 就设置下
    if (!item.symbol) {
        const obj = arr[0];
        switch (activeTab.value) {
            case 1:
                store.commit('setCurrSpot', obj || {});
                break;
            case 2:
                store.commit('setCurrConstract', obj || {});
                break;
            case 3:
            case 4:
                store.commit('setCurrAi', obj || {});
                break;
        }
    }
    subs()
}
const initTabList = (more) => {
    searchLoading2.value = true
    if (more === true) {
        page.value++
    } else {
        page.value = 1
        finish.value = false
    }
    const tab = activeTab.value
    if (activeTab.value == 3 || activeTab.value == 4) { // ai
        _aiquant2({
            type: '',
            name: "",
            page: page.value,
        }).then(res => {
            handleData(res, more, tab)
        }).finally(() => {
            searchLoading2.value = false;
        });
    } else if (activeTab.value == 1) { // 现货
        _trade({
            name: "",
            page: page.value,
        }).then(res => {
            handleData(res, more, tab)
        }).finally(() => {
            searchLoading2.value = false;
        });
    } else if ([2].includes(activeTab.value)) { // 合约下分类
        let type = ''
        switch (tab) {
            case 2:
                type = 'crypto'
                break;
        }
        _futures({
            name: "",
            type: type,
            page: page.value,
        })
            .then((res) => {
                handleData(res, more, tab)
            })
            .finally(() => {
                searchLoading2.value = false;
            });
    } else {
        searchLoading2.value = false
    }
};
// 搜索更多数据
const loadMore = () => {
    if (searchLoading2.value || finish.value) return
    initTabList(true)
}


watch(route, (val) => {
    if (val.name == "trade" && val.query.marketType) {
        setTab()
        setTimeout(() => {
            tabChange(activeTab.value)
        }, 0)
    } else {
        tabChange(activeTab.value)
    }
}, { immediate: true })

let moreDom = null;
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect();
    if (rect.top <= totalHeight) {
        // 加载更多
        loadMore()
    }
};
const openedList = (scrollBox) => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector(".trade-more");
            document
                .querySelector(scrollBox)
                .addEventListener("scroll", scrolHandle);
        } catch { }
    }, 1000);
}
const closeList = (scrollBox) => {
    try {
        document
            .querySelector(scrollBox)
            .removeEventListener("scroll", scrolHandle);
    } catch { }
}




defineExpose({
    activeTab
})



const loaded = ref(false)
onMounted(() => {
    if (props.from == 'trade') {
        openedList('.page-trade3')
    }
    setTimeout(() => {
        loaded.value = true
    }, 500)
})
onBeforeUnmount(() => {
    if (props.from == 'trade') {
        closeList('.page-trade3')
    }
    loaded.value = false
})

const filterList = list => {
    if (props.from == 'home') return list.slice(0, 10)
    return list
}
</script>

<style lang="less" scoped>
.home-tab-box-trade {
    // border-radius: 0.32rem;
    min-height: calc(var(--vh) * 100 - 4rem);
}

.home-tabs-box-trade {
    :deep(.van-tabs--top) {
        .van-tabs__wrap {
            height: 0.64rem;

            .van-tabs__nav {
                height: 0.64rem;
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
                        bottom: 1px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-image: url('static/img/common/active_tab.svg');
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

.home-tabs-box-inner {
    :deep(.van-tabs--line-card-trade) {
        &>.van-tabs__wrap {
            position: relative;

            &::after {
                display: none;
            }

            &>.van-tabs__nav {
                margin-right: 0.4rem;
            }
        }
    }
}

.home-tabs-box-home {


    :deep(.van-tabs--sub) {
        &>.van-tabs__wrap .van-tabs__nav {

            padding: 0 0.2rem;
        }
    }

    :deep(.van-tabs--sub) {
        margin-top: 0;
    }


    :deep(.van-tabs__nav) {
        background-color: var(--ex-none);

        .van-tab {
            background-color: #171717;
            color: var(--ex-text-color2);
            min-width: 1.2rem;
            font-size: 0.28rem;
        }

        .van-tab--active {
            color: var(--ex-white) !important;
            background-color: var(--ex-primary-color) !important;
        }
    }

    :deep(.page_ipo) {
        padding-top: 0.32rem;

        .list {
            padding: 0;
        }

        .loading_more {
            display: none;
        }
    }
}
</style>