<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <div class="top_icon_container">
      <Top>
        <template #right>
          <div class="flex gap-1">
            <div class="size-[0.64rem]" @click="goLang">
                <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
            </div>
          </div>
        </template>
      </Top>
    </div>
    <div class="icon">
      <img v-lazy="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("register.success_sign_up") }}</div>

    <Button round color="var(--ex-primary-color)" class="submit ripple-btn" type="primary" @click="next"><span class="text-[0.32rem] text-white">{{
      $t("register.success_btn")
    }}</span></Button>
    <div @click="back">
      <span class="text-white text-[0.32rem]">{{
        $t('register.success_finish') }}</span>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Icon } from "vant";
import router from "@/router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";
const { t } = useI18n();

const route = useRoute();

const next = () => {
  router.replace({
    name: "google",
    query: {
      from: "register",
    },
  });
};
const back = () => {
  router.replace({
    name: "user",
  });
};
const goBack = () => {
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      },
    });
  } else {
    router.back();
  }
};

//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

const goChat = () => {
  router.push({ name: "chat" });
};
</script>

<style lang="less" scoped>
.page_register_success {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 0 0.32rem;

  .top_icon_container {
    position: fixed;
    width: 7.5rem;
    justify-content: space-between;
    padding: 0 0.32rem;
    height: 1.12rem;
    display: flex;
    align-items: center;
    top: 0;
    background-color: var(--ex-bg-color);
  }

  .icon {
    width: 2.22rem;
    height: 1.78rem;
    margin-top: 2.64rem;
    margin-bottom: 0.36rem;
  }

  .title {
    color: var(--ex-text-color);
    font-weight: 400;
    font-size: 0.32rem;
    line-height: 0.42rem;
    margin-bottom: 0.68rem;
  }

  .submit {
    width: max-content;
    width: 4.5rem;
    height: 0.92rem;
    margin-bottom: 0.6rem;
    font-size: 0.3rem;
    font-weight: 400;
    color: var(--ex-white);
  }

  :deep(.van-button__text) {
    color: var(--ex-black);
  }
}
</style>
