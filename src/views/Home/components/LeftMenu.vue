<!-- 左侧弹出 -->
<template>
    <Popup v-model:show="showLeft" round position="left" :style="{ width: '90%', height: '100%' }">
        <div class="left-menu">
            <!-- 用户 -->
            <div class="user-box">
                <div class="avatar">
                    <img v-if="token" v-lazy="getStaticImgUrl('/static/img/user/avatar2.svg')" alt="">
                    <img v-else @click="goLogin" v-lazy="getStaticImgUrl('/static/home2/avatar.svg')" alt="">
                </div>
                <div class="con" @click="goLogin">
                    <div v-if="token">
                        <div>
                            {{ userInfo.username || "--" }}
                        </div>
                        <div class="text-color2 text-[0.28rem] mt-[0.16rem]">
                            ID:{{ userInfo.uid || "--" }}
                        </div>
                    </div>
                    <div v-else>{{ $t("user_page.login_out") }}</div>
                </div>
                <div class="close" @click="close">
                    <img v-lazy="getStaticImgUrl('/static/home2/menu-close.svg')" alt="">
                </div>
            </div>

            <!-- 推广 -->
            <div class="po-box">
                <div class="po-item">
                    <div class="num">0</div>
                    <div>{{ $t('user_page.recommended_user') }}</div>
                </div>
                <div class="po-item">
                    <div class="num">0</div>
                    <div>{{ $t('user_page.social_user') }}</div>
                </div>
                <div class="po-item">
                    <div class="num">0</div>
                    <div>{{ $t('user_page.recommend_bonus') }}</div>
                </div>
            </div>

            <!-- 导航 -->
            <div class="navs">
                <div class="nav-item pb-[0.28rem] relative" @click="jump('account', true)">
                    <div class="nav-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/nav-1.svg')" alt="">
                    </div>
                    <div class="absolute text-center w-full top-[0.7rem]">{{ $t('user_page.receive_payment') }}</div>
                </div>
                <div class="nav-item pb-[0.28rem] relative" @click="jump('kyc', true)">
                    <div class="nav-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/nav-2.svg')" alt="">
                    </div>
                    <div class="absolute text-center w-full top-[0.7rem]">{{ $t('user_page.verify_identity') }}</div>

                    <div v-if="token" class="status-box" :class="[
                        userInfo.kycl2 == 0
                            ? 'bg-error'
                            : `${userInfo.kycl2 == 1 ? 'bg-warning' : 'bg-primary'}`,
                    ]">
                        <span style="width: max-content;" v-if="userInfo.kycl2 == 0">{{ $t("user_page.not_verified")
                            }}</span>
                        <span style="width: max-content;" v-else-if="userInfo.kycl2 == 1">{{
                            $t("user_page.pending_verified")
                            }}</span>
                        <span style="width: max-content;" v-else>{{ $t("user_page.already_verified") }}</span>
                    </div>
                </div>
                <div class="nav-item pb-[0.28rem] relative" @click="jump('googleCode', true)">
                    <div class="nav-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/nav-3.svg')" alt="">
                    </div>
                    <div class="absolute text-center w-full top-[0.7rem]">{{ $t('user_page.google_verification') }}</div>

                    <div v-if="token" class="status-box"
                        :class="[userInfo.googlebind == 0 ? 'bg-error' : 'bg-primary']">
                        <span v-if="userInfo.googlebind == 0">{{ $t("user_page.not_set") }}</span>
                        <span v-else>{{ $t("user_page.already_set") }}</span>
                    </div>
                </div>
                <div class="nav-item pb-[0.28rem] relative" @click="jump('inviteFriends', true)">
                    <div class="nav-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/nav-4.svg')" alt="">
                    </div>
                    <div class="absolute text-center w-full top-[0.7rem]">{{ $t('user_page.recommend_friend') }}</div>
                </div>
            </div>


            <!-- 滚动导航 -->
            <div class="scroll-box">
                <div class="tab-box">
                    <div class="tab-title">{{ $t('user_page.manage_assets') }}</div>
                    <div class="tabs">
                        <div class="tab" @click="jump('topUpCrypto', true)">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-1.svg')" alt="">
                            </div>
                            <div>{{ $t('home.recharge') }}</div>
                        </div>
                        <div class="tab" @click="jump('withdraw', true)">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-2.svg')" alt="">
                            </div>
                            <div>{{ $t('assets.withdraw') }}</div>
                        </div>
                        <div class="tab" @click="jump('transfer', true)">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-3.svg')" alt="">
                            </div>
                            <div>{{ $t('assets.transfer') }}</div>
                        </div>
                        <div class="tab" @click="jump('recordList', true)">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-4.svg')" alt="">
                            </div>
                            <div>{{ $t('assets.financialRecords') }}</div>
                        </div>
                    </div>
                </div>

                <div class="tab-box">
                    <div class="tab-title">{{ $t('trade.ai_opening_trade') }}</div>
                    <div class="tabs">
                        <div class="tab">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-5.svg')" alt="">
                            </div>
                            <div>{{ $t('home.simulatedTradingButton') }}</div>
                        </div>
                        <div class="tab" @click="jump('tradeInfo', false, { tradeType: 'spot' })">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-6.svg')" alt="">
                            </div>
                            <div>{{ $t('common.spot') }}</div>
                        </div>
                        <div class="tab" @click="jump('tradeInfo', false, { tradeType: 'constract' })">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-7.svg')" alt="">
                            </div>
                            <div>{{ $t('common.crypto') }}</div>
                        </div>
                        <div class="tab" @click="jump('tradeInfo', false, { tradeType: 'ai' })">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-8.svg')" alt="">
                            </div>
                            <div>{{ $t('common.option') }}</div>
                        </div>
                        <div class="tab" style="margin-top: 0.4rem;"
                            @click="jump('tradeInfo', false, { tradeType: 'ai' })">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-9.svg')" alt="">
                            </div>
                            <div>ETF</div>
                        </div>
                    </div>
                </div>

                <div class="tab-box">
                    <div class="tab-title">{{ $t('home.finance') }}</div>
                    <div class="tabs">
                        <div class="tab mr-[0.1rem]" @click="jump('follow')">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-10.svg')" alt="">
                            </div>
                            <div>{{ $t('copy.title') }}</div>
                        </div>
                        <div class="tab mr-[0.1rem]" @click="jump('loan', true)">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-11.svg')" alt="">
                            </div>
                            <div>{{ $t('finance.defi_borrow') }}</div>
                        </div>
                        <div class="tab" @click="jump('finance', true, { activeTab: 1 })">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-12.svg')" alt="">
                            </div>
                            <div>{{ $t('finance.portfolio_title') }}</div>
                        </div>
                    </div>
                </div>


                <div class="tab-box">
                    <div class="tab-title">{{ $t('user_page.user_func') }}</div>
                    <div class="tabs">
                        <div class="tab" @click="jump('chat')">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-13.svg')" alt="">
                            </div>
                            <div>{{ $t('user_page.support') }}</div>
                        </div>
                        <div class="tab" @click="jump('notification')">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-14.svg')" alt="">
                            </div>
                            <div>{{ $t('user_page.news') }}</div>
                        </div>
                        <div class="tab" @click="jump('language')">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-15.svg')" alt="">
                            </div>
                            <div>{{ $t('user_page.set_language') }}</div>
                        </div>
                        <div class="tab" @click="jump('safety', true)">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-16.svg')" alt="">
                            </div>
                            <div>{{ $t('user_page.security') }}</div>
                        </div>
                        <div class="tab" style="margin-top: 0.4rem;" @click="jump('about')">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-17.svg')" alt="">
                            </div>
                            <div>{{ $t('user_page.about') }}</div>
                        </div>
                        <div class="tab" style="margin-top: 0.4rem;">
                            <div class="tab-icon">
                                <img v-lazy="getStaticImgUrl('/static/home2/tab-18.svg')" alt="">
                            </div>
                            <div>{{ $t('user_page.setting') }}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </Popup>
</template>

<script setup>
import { Popup } from "vant"
import { ref, computed } from "vue"
import store from "@/store"
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";

// const props = defineProps({
//     jump: Function
// })
// 跳转
const jump = (name, needToken, query) => {
    if (needToken && !token.value) {
        LeftRef.value.close()
        setTimeout(() => {
            store.commit("setIsLoginOpen", true);
        }, 0)
        return
    }

    router.push({
        name,
        query
    });
};

const token = computed(() => store.state.token)
const userInfo = computed(() => store.state.userInfo || {});
const goLogin = () => {
    close()
    setTimeout(() => {
        store.commit('setIsLoginOpen', true)
    }, 0)
}


// 开关
const showLeft = ref(false)
const open = () => {
    showLeft.value = true
}
const close = () => {
    showLeft.value = false
}

defineExpose({
    open,
    close,
})
</script>

<style lang="less" scoped>
.left-menu {
    width: 100%;
    height: 100%;
    background-color: var(--ex-bg-color3);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .user-box {
        padding: 0.6rem 0.32rem 0.48rem 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .avatar {
            width: 1rem;
            height: 1rem;
            margin-right: 0.24rem;
        }

        .con {
            font-size: 0.32rem;
            color: var(--ex-white);
            flex: 1;
            text-align: left;
        }

        .close {
            width: 0.48rem;
            height: 0.48rem;
            margin-left: 0.24rem;
        }
    }

    .po-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .po-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--ex-placeholder-color);
            font-size: 0.24rem;
            padding-bottom: 0.32rem;
            border-bottom: 1px solid var(--ex-bg-white2);

            .num {
                color: var(--ex-white);
                font-size: 0.32rem;
                margin-bottom: 0.16rem;
            }
        }
    }

    .navs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.4rem 0;
        border-bottom: 1px solid var(--ex-bg-white2);

        .nav-item {
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.24rem;
            color: var(--ex-white);

            .nav-icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-bottom: 0.2rem;
            }

            .status-box {
                position: absolute;
                height: 0.3rem;
                padding-top: 0.02rem;
                font-size: 0.24rem;
                padding: 0 0.08rem;
                top: -0.18rem;
                right: -0.2rem;
                border-radius: 0.12rem;
                line-height: 1;
                display: flex;
                align-items: center;
            }
        }
    }

    .scroll-box {
        flex: 1;
        overflow-y: auto;
    }

    .tab-box {
        padding: 0.32rem 0 0.4rem 0;
        border-bottom: 1px solid var(--ex-bg-white2);

        .tab-title {
            color: var(--ex-text-color5);
            font-size: 0.28rem;
            margin-bottom: 0.4rem;
            padding-left: 0.32rem;
        }

        .tabs {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding-right: 0.1rem;

            .tab {
                width: 25%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 0.24rem;
                color: var(--ex-white);

                .tab-icon {
                    width: 0.48rem;
                    height: 0.48rem;
                    margin-bottom: 0.2rem;
                }
            }
        }
    }
}
</style>