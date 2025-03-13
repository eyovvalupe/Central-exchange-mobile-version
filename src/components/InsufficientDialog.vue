<!-- 余额不足弹窗 -->
<template>
    <BottomPopup closeable v-model:show="visible" :title="'充值/划转'">
        <div class="insufficient-dialog">
            <div class="tip">
                <div class="tip-icon">
                    <img :src="getStaticImgUrl('/static/img/common/warning.svg')" alt="img">
                </div>
                <div class="tip-con">
                    您的账户<span>余额不足</span>，请先充值/划转再继续交易
                </div>
            </div>
            <div class="account-box">
                <div class="title">{{ typeMap[type] || '--' }}</div>
                <div class="account-item">
                    <span>可用余额</span>
                    <span><span class="amount">{{ amount }}</span> {{ currency }}</span>
                </div>
            </div>
            <div class="btns">
                <div class="btn" @click="jump('transfer')">划转</div>
                <div class="btn" @click="jump('topUpCrypto')">充值</div>
            </div>
        </div>
    </BottomPopup>
</template>

<script setup>
import { ref } from "vue"
import BottomPopup from "./BottomPopup.vue"
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import eventBus from "@/utils/eventBus.js"

const visible = ref(false)
const jump = name => {
    visible.value = false
    router.push({ name })
}

// 接收参数
const typeMap = ref({
    'stock': '股票账户',
    'spot': '现金账户',
    'crypto': '合约账户',
})
const type = ref('') // 钱包类型
const currency = ref('') // 币种
const amount = ref('') // 余额
eventBus.on('insufficient', obj => {
    type.value = obj.type
    currency.value = obj.currency
    amount.value = obj.amount
    visible.value = true
})

</script>

<style lang="less" scoped>
.insufficient-dialog {
    padding: 0.4rem 0.32rem 0.6rem 0.32rem;
    color: var(--ex-text-color);

    .tip {
        background-color: rgba(232, 80, 58, 0.10);
        border-radius: 0.32rem;
        display: flex;
        align-items: flex-start;
        padding: 0.2rem 0.24rem;
        font-size: 0.28rem;

        .tip-icon {
            width: 0.28rem;
            height: 0.28rem;
            margin-right: 0.22rem;
            position: relative;
            top: 0.04rem;
        }

        .tip-con {
            span {
                color: var(--ex-error-color);
            }
        }
    }

    .account-box {
        margin-top: 0.5rem;

        .title {
            font-size: 0.32rem;
            margin-bottom: 0.36rem;
        }

        .account-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.28rem;
            color: var(--ex-text-color3);

            .amount {
                color: var(--ex-primary-color);
                margin-right: 0.04rem;
            }
        }
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.5rem;

        .btn {
            border: 1px solid var(--ex-primary-color);
            color: var(--ex-primary-color);
            width: 3.2rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
            border-radius: 1.3rem;
        }
    }
}
</style>