<!-- 推荐好友 -->
<template>
  <div class="page">
    <HeaderTabs v-model:active="activeTab" :tabs="[$t('inviteFriends.invite'), $t('inviteFriends.reward')]"
      @change="changeActiveTab(activeTab, true)">
      <template #before>
        <div class="back" @click="back()">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img v-lazy="getStaticImgUrl('/static/img/user/back.svg')" />
          </div>
        </div>
      </template>
    </HeaderTabs>
    <Swipe :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" ref="swipe" @change="swipeChange">
      <SwipeItem>
        <div class="scroll-box">
          <div class="px-[0.32rem] pt-[0.26rem] pb-[0.64rem]">
            <div class="invite_banner" :class="['invite_banner--' + locale]">
              <img class="invite_banner_img" v-lazy="getStaticImgUrl('/static/img/user/banner2.svg')" />
              <div class="invite_banner_titbox">
                <div class="invite_banner_tit">
                  {{ $t("inviteFriends.banner_title") }}
                </div>
                <div class="invite_banner_amount text-primary mt-[0.04rem]">
                  <MoneyText :text="'$'" />
                  <MoneyText v-for="(text, i) in moneyTextArr" :key="i" :text="text" />
                </div>
                <div class="invite_banner_desc">
                  {{ $t("inviteFriends.banner_desc") }}
                </div>
              </div>
            </div>

            <div class="invite_title">
              {{ $t("inviteFriends.qrcode_title") }}
            </div>
            <div class="invite_qrcode">
              <img :src="codeUrl" />
            </div>
            <div class="btn ripple-primary" @click="saveImg">
              {{ $t("inviteFriends.save_img") }}
            </div>

            <div class="invite_title">
              {{ $t("inviteFriends.invite_code") }}
            </div>
            <div class="input-box">
              <input v-model="inviteCode" disabled />
              <div class="copy ripple-primary" @click="copy(inviteCode)">
                {{ $t("inviteFriends.copy") }}
              </div>
            </div>

            <div class="invite_title">{{ $t("inviteFriends.url_title") }}</div>
            <div class="input-box">
              <input v-model="url" disabled />
            </div>
            <div class="btn ripple-primary" @click="copy(url)">
              {{ $t("inviteFriends.copy_url") }}
            </div>
          </div>
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="scroll-box">
          <div class="px-[0.32rem] pt-[0.26rem] pb-[0.64rem]">
            <div class="achievement1">
              <div class="achievement_cont items-center">
                <div class="achievement_text">
                  {{ $t("inviteFriends.performance_title") }}
                </div>
                <div class="achievement_amount text-primary">20000</div>
              </div>
              <img class="achievement_bg" v-lazy="getStaticImgUrl('/static/img/user/achievement.svg')" />
            </div>
            <div class="invite-title">{{ $t("inviteFriends.details") }}</div>
            <div class="record-tit">
              <span class="text-color5">{{ $t("inviteFriends.user") }}</span>
              <span class="text-color5">{{ $t("inviteFriends.performance") }}</span>
            </div>
            <div class="record-list">
              <div class="record-item" v-for="(item, i) in list" :key="i">
                <span class="text-color2">{{ item.email }}</span>
                <strong>{{ item.amount }}</strong>
              </div>
            </div>
          </div>
        </div>
      </SwipeItem>
    </Swipe>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Swipe, SwipeItem, showToast } from "vant";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { computed, onMounted, ref } from "vue";
import { _copyTxt } from "@/utils/index";
import { useI18n } from "vue-i18n";
import router from "@/router";
import QRCode from "qrcode";
import MoneyText from "@/components/MoneyText.vue";
import store from "@/store";
import { MOBILE_INVITE_URL } from "@/config";

const { t, locale } = useI18n();

const userInfo = computed(() => store.state.userInfo);
const swipe = ref(null);

const back = () => {
  router.back();
};
const changeActiveTab = (val, slideSwipe = false) => {
  activeTab.value = val;
  if (slideSwipe && swipe.value) {
    swipe.value.swipeTo(val);
  }
};

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t("inviteFriends.copy_success"));
};

const codeUrl = ref("");
const activeTab = ref(0);
const initialSwipe = ref(activeTab.value);
const inviteCode = computed(() => store.state.userInfo.uid);
const moneyTextArr = ref(['1', '0', '0', '0', '0']);
QRCode.toDataURL(`${MOBILE_INVITE_URL}?inviteCode=${userInfo.value.uid}`).then((url) => {
  codeUrl.value = url;
});

const saveImg = () => {
  var a = document.createElement("a");
  a.href = codeUrl.value;
  a.download = t("inviteFriends.img_name");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const list = ref([
  {
    email: "sjhds@gmal.com",
    amount: 2000,
  },
  {
    email: "sjhds@gmal.com",
    amount: 2000,
  },
  {
    email: "sjhds@gmal.com",
    amount: 2000,
  },
  {
    email: "sjhds@gmal.com",
    amount: 2000,
  },
  {
    email: "sjhds@gmal.com",
    amount: 2000,
  },
  {
    email: "sjhds@gmal.com",
    amount: 2000,
  },
]);
const url = ref(`${MOBILE_INVITE_URL}?inviteCode=${userInfo.value.uid}`);
const swipeChange = (val) => {
  activeTab.value = val;
};

</script>

<style lang="less" scoped>
.page :deep(.header_tabs) {
  position: relative;
}

.page :deep(.header_tabs .tab_body) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-box {
  height: calc(var(--vh) * 100 - 1.12rem);
  overflow-y: auto;
}

.back {
  width: 0.6rem;
  height: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0.32rem;
  margin: auto 0;
  z-index: 1;
  border-radius: 0.1rem;
  background-color: var(--ex-bg-color5);
}

.invite_banner {
  position: relative;
  height: 2.64rem;
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color5);

  &_img {
    width: 100%;
    display: block;
    height: 100%;
  }
}

.invite_banner_titbox {
  position: absolute;
  left: 0.4rem;
  top: 0.38rem;
}

.invite_banner_tit {
  color: var(--ex-white);
  font-size: 0.4rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.52rem;
  /* 160% */
  padding-bottom: 0.12rem;
  width: 4.2rem;
}

.invite_banner--en .invite_banner_titbox {
  top: 0.2rem;
}

.invite_banner--en .invite_banner_desc {
  font-size: 0.24rem;
}

.invite_banner_amount {
  font-family: "Lilita One";
  font-size: 0.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.64rem;
  display: flex;
  align-items: center;
}

.invite_banner_desc {
  color: var(--ex-white);
  font-size: 0.28rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.28rem;
  margin-top: 0.26rem;
}

.invite_title {
  color: var(--ex-text-color5);
  font-size: 0.28rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.32rem;
  margin-bottom: 0.2rem;
  margin-top: 0.4rem;
}

.invite_qrcode {
  border-radius: 0.3rem;
  border: 1px solid var(--ex-border-color);
  width: 2.7rem;
  height: 2.7rem;
  box-sizing: border-box;

  img {
    width: 100%;
    height: 100%;
    border-radius: 0.3rem;
  }
}

.input-box {
  border-radius: 0.32rem;
  height: 1.12rem;
  box-sizing: border-box;
  font-size: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--ex-bg-color5);

  input {
    width: 100%;
    border: 0px;
    padding: 0;
    margin: 0;
    height: 0.4rem;
    flex: 1;
    line-height: 0.4rem;
    padding: 0 0.32rem;
  }

  .copy {
    padding: 0 0.32rem;
    min-width: 1.28rem;
    color: var(--ex-black);
    line-height: 1.12rem;
    font-size: 0.3rem;
    background-color: var(--ex-white);
    border-radius: 0.32rem;
  }
}

.btn {
  width: 2.7rem;
  height: 0.7rem;
  margin-top: 0.2rem;
  background-color: var(--ex-white);
  color: var(--ex-black);
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 0.3rem;
  border-radius: 0.2rem;
}

.achievement {
  width: 100%;
  height: 2.34rem;
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color5);
  position: relative;
}

.achievement1 {
  width: 100%;
  height: 2.4rem;
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color5);
  position: relative;
}

.achievement_cont {
  display: flex;
  flex-direction: column;
  padding-top: 0.6rem;
}

.achievement_text {
  color: var(--ex-white);
  font-size: 0.28rem;
  font-weight: 500;
}

.achievement_amount {
  font-family: "PingFang SC";
  font-size: 0.6rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.6rem;
  margin-top: 0.26rem;
}

.achievement_bg {
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0;
  bottom: 0;
}

.invite-title {
  font-size: 0.4rem;
  font-weight: 600;
  color: var(--ex-text-color);
  padding: 0.6rem 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-tit {
  line-height: 0.4rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.28rem;
  color: var(--ex-text-color2);
}

.record-list {
  padding: 0.1rem 0;
}

.record-item {
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color5);
  display: flex;
  justify-content: space-between;
  padding: 0.32rem;
  line-height: 0.52rem;
  margin-top: 0.2rem;
  font-size: 0.32rem;
}
</style>
