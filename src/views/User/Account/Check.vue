<!-- 认证检测 -->
<template>
    <div class="page page-check">
        <Top :icon="'cross'" :title="'身份验证'" />
        <div class="check_box">
            <div class="ways">
                <div v-if="!userInfo.googlebind" class=" way" @click="router.push({ name: 'google' })">
                    <div class="left">
                        <div class="title">谷歌验证器未绑定</div>
                        <div class="info">
                            <span>去绑定</span>
                            <div class="btn">
                                <div class="btn_icon">
                                    <img v-lazy="getStaticImgUrl('/static/img/user/right.svg')" alt="→">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <img v-lazy="getStaticImgUrl('/static/img/user/google-1.svg')" alt="google">
                        <img class="status_icon" v-lazy="getStaticImgUrl('/static/img/user/no.svg')" alt="no">
                    </div>
                </div>
                <div v-if="userInfo.kycl2 != 2" class=" way" @click="router.push({ name: 'kyc' })">
                    <div class="left">
                        <div class="title">实名认证未通过 </div>
                        <div class="info">
                            <span>去绑定</span>
                            <div class="btn">
                                <div class="btn_icon">
                                    <img v-lazy="getStaticImgUrl('/static/img/user/right.svg')" alt="→">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <img v-lazy="getStaticImgUrl('/static/img/user/iden-1.svg')" alt="iden">
                        <img class="status_icon" v-lazy="getStaticImgUrl('/static/img/user/no.svg')" alt="no">
                    </div>
                </div>

                <div v-if="userInfo.googlebind" class=" way active_way">
                    <div class="left">
                        <div class="title">谷歌验证器已绑定 </div>
                    </div>
                    <div class="right">
                        <img v-lazy="getStaticImgUrl('/static/img/user/google-2.svg')" alt="google">
                        <img class="status_icon" v-lazy="getStaticImgUrl('/static/img/user/ok.svg')" alt="no">
                    </div>
                </div>
                <div v-if="userInfo.kycl2 == 2" class=" way active_way">
                    <div class="left">
                        <div class="title">已通过实名认证 </div>
                    </div>
                    <div class="right">
                        <img v-lazy="getStaticImgUrl('/static/img/user/iden-2.svg')" alt="google">
                        <img class="status_icon" v-lazy="getStaticImgUrl('/static/img/user/ok.svg')" alt="no">
                    </div>
                </div>
            </div>
            <div style="flex:1"></div>
            <div class="server_icon">
                <img v-lazy="getStaticImgUrl('/static/img/common/server.svg')" alt="server">
            </div>
            <div class="server">if you have questions contact <br /><span>customer service</span></div>
            <Button @click="router.back()" round color="var(--ex-bg-color2)" class="submit" type="primary">
                <span class="text-color3">关闭</span>
            </Button>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from '@/components/Top.vue';
import { Button } from "vant"
import router from '@/router';
import { computed } from "vue"
import store from '@/store';

const userInfo = computed(() => store.state.userInfo || {})
</script>

<style lang="less" scoped>
.page-check {
    padding-top: 1.12rem;

    .check_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 1.4rem 0.32rem 0.4rem 0.32rem;
        height: 100%;

        .ways {
            width: 100%;

            .way {
                width: 100%;
                height: 2.2rem;
                background-color: var(--ex-bg-color2);
                box-shadow: 0px 5px 30px 0px rgba(0, 0, 0, 0.05);
                border-radius: 0.2rem;
                margin-bottom: 0.6rem;
                padding: 0.64rem 0.7rem 0 0.32rem;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                overflow: hidden;

                .left {
                    flex: 1;

                    .title {
                        font-weight: 400;
                        color: var(--ex-text-color);
                        font-size: 0.32rem;
                        line-height: 0.48rem;
                        margin-bottom: 0.18rem;
                    }

                    .info {
                        font-weight: 400;
                        font-size: 0.24rem;
                        line-height: 0.32rem;
                        color: var(--ex-primary-color);
                        padding-left: 0.1rem;
                        display: flex;
                        align-items: center;

                        .btn {
                            width: 1.02rem;
                            height: 0.44rem;
                            background-color: var(--ex-primary-color);
                            border-radius: 1.02rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 0.2rem;

                            .btn_icon {
                                width: 0.16rem;
                                height: 0.16rem;
                                line-height: 0.16rem;
                            }


                        }
                    }
                }

                .right {
                    position: relative;
                    width: 0.84rem;
                    height: 0.84rem;
                    top: 0.2rem;

                    .status_icon {
                        position: absolute;
                        width: 0.32rem !important;
                        height: 0.32rem !important;
                        bottom: -0.05rem;
                        right: -0.05rem;
                    }
                }
            }

            .active_way {
                background-color: var(--ex-primary-color);

                .left {
                    .title {
                        color: var(--ex-white);
                        line-height: 1;
                    }
                }

                .right {
                    top: 0.1rem;
                }
            }
        }


        .server_icon {
            width: 0.8rem;
            height: 0.8rem;
            margin-bottom: 0.28rem;
        }

        .server {
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 0.32rem;
            margin-bottom: 0.4rem;
            color: var(--ex-text-color);
            text-align: center;

            span {
                color: var(--ex-primary-color);
            }
        }

        .submit {
            width: 100%;
            margin-bottom: 0.8rem;
        }
    }
}
</style>