<!-- 认证状态检测 -->
<template>
  <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" teleport="body" v-model:show="showBottom"
    position="bottom" style="background-color: rgba(0,0,0,0)">
    <div class="account_check_popup">
      <div class="close_icon" @click="close">
        <img v-lazy="getStaticImgUrl('/static/img/common/close.svg')" alt="img">
      </div>
      <div class="account_check_popup_title">账户升级</div>

      <div class="ac_body">
        <div class="ac_title" v-if="userInfo.role == 'guest'">升级为正式账户</div>
        <div class="fake_user" v-if="userInfo.role == 'guest'">
          <div class="fake_icon_box">
            <img v-lazy="getStaticImgUrl('/static/img/account/iden_up.svg')" alt="img">
          </div>
          <div>模拟账号升级</div>
          <div class="fake_btn">立刻升级→</div>
        </div>
        <div class="ac_title">请完成以下验证，继续下一步</div>
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

          <div v-if="loanNum" class="load_num">借贷订单数 <span style="font-weight: bold;color: red">{{ loanNum
          }}</span></div>
        </div>


        <div style="flex:1"></div>
        <div class="server_icon">
          <img v-lazy="getStaticImgUrl('/static/img/common/server.svg')" alt="server">
        </div>
        <div class="server">if you have questions contact <br /><span>customer service</span></div>
      </div>

    </div>
  </Popup>
</template>

<script setup>
import { Popup, showConfirmDialog } from 'vant';
import { ref, computed } from "vue"
import store from '@/store';
import router from '@/router';
import { getStaticImgUrl } from "@/utils/index.js"
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  from: {
    type: String,
    default: ''
  }
})
// store.dispatch("updateOrderHint")
const userInfo = computed(() => store.state.userInfo || {})
const loanNum = computed(() => store.state.loanNum || 0)

const showBottom = ref(false)
const open = () => {
  showBottom.value = true
}
const close = () => {
  showBottom.value = false
}

const check = () => {
  // const val = userInfo.value.googlebind && userInfo.value.kycl2 == 2 && userInfo.value.role == 'user'
  // if (!val) {
  //     open()
  // }
  // return val
  // if (userInfo.value.role != 'user') {
  //     setTimeout(() => {
  //         showConfirmDialog({
  //             title: '账号升级',
  //             message:
  //                 '模拟账号不能进行该操作，去升级？',
  //         })
  //             .then(() => {
  //                 router.push({ name: 'kyc' })
  //             })
  //             .catch(() => {
  //                 router.back()
  //             });
  //     }, 400)
  //     return false
  // }
  if (userInfo.value.role == 'guest') {
    setTimeout(() => {
      showConfirmDialog({
        title: t('common.verify_title'),
        message: t('common.verify_con'),
      })
        .then(() => {
          router.replace({ name: 'home' });
          store.commit('setIsLoginOpen', true);
        })
        .catch(() => {
          router.back();
        });
    }, 400);
    return false;
  }
  if (!['kyc', 'withdraw', 'topUpCrypto'].includes(props.from) && !userInfo.value.googlebind) {
    setTimeout(() => {
      showConfirmDialog({
        title: t('user_page.google_verification'),
        message:
          t('common.no_link_google'),
        theme: 'round-button',
        cancelButtonText: t('user_page.message_box_cancel'),
        confirmButtonText: t('user_page.message_box_confirm')
      })
        .then(() => {
          router.push({ name: 'google' })
        })
        .catch(() => {
          router.back()
        });
    }, 400)
    return false
  }
  if (!['kyc', 'safety'].includes(props.from) && userInfo.value.kycl2 != 2) {
    setTimeout(() => {
      showConfirmDialog({
        title: t('common.kyc_verify_title'),
        message:
          t('common.kyc_verify_con'),
        theme: 'round-button',
        cancelButtonText: t('user_page.message_box_cancel'),
        confirmButtonText: t('user_page.message_box_confirm')
      })
        .then(() => {
          router.push({ name: 'kyc' })
        })
        .catch(() => {
          router.back()
        });
    }, 400)
    return false
  }
  return true
}

defineExpose({
  open,
  close,
  check,
})
</script>

<style lang="less">
.account_check_popup {
  background-color: var(--ex-bg-color);
  overflow: hidden;
  padding: 0.2rem 0.32rem 0.64rem 0.32rem;
  position: relative;
  height: var(--app-height);

  .account_check_popup_title {
    text-align: center;
    line-height: 0.64rem;
    font-size: 0.32rem;
  }

  .close_icon {
    position: absolute;
    top: 0.38rem;
    left: 0.32rem;
    width: 0.32rem;
    height: 0.32rem;
  }

  .ac_body {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: space-between;

    .ac_title {
      width: 100%;
      text-align: left;
      font-size: 0.28rem;
      color: var(--ex-text-color);
      line-height: 0.64rem;
      margin: 0.24rem 0;
    }

    .fake_user {
      height: 1.5rem;
      background-color: var(--ex-bg-color2);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.8rem 0 0.32rem;
      border-radius: 0.16rem;

      .fake_icon_box {
        width: 0.96rem;
        height: 0.96rem;
        background-color: var(--ex-bg-color4);
        padding: 0.16rem;
        border-radius: 0.16rem;
        margin-right: 0.6rem;
      }

      .fake_btn {
        background-color: var(--ex-primary-color);
        height: 0.68rem;
        display: flex;
        align-items: center;
        padding: 0 0.24rem;
        border-radius: 0.4rem;
        color: var(--ex-text-color--bg-primary);
        font-size: 0.24rem;
        margin-left: 0.6rem;
      }
    }

    .ways {
      width: 100%;

      .load_num {
        width: 100%;
        text-align: left;
      }

      .way {
        width: 100%;
        height: 1.8rem;
        background-color: var(--ex-bg-color2);
        box-shadow: 0px 5px 30px 0px rgba(0, 0, 0, 0.05);
        border-radius: 0.16rem;
        margin-bottom: 0.6rem;
        padding: 0 0.7rem 0 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        .left {
          flex: 1;

          .title {
            font-weight: 400;
            color: var(--ex-text-color);
            font-size: 0.28rem;
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
            color: var(--ex-text-color--bg-primary);
            ;
            line-height: 1;
          }
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
      margin-bottom: 1rem;
      color: var(--ex-text-color);
      text-align: center;

      span {
        color: var(--ex-primary-color);
      }
    }
  }
}
</style>