<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <Top>
      <template #right>
        <div class="flex gap-1">
          <div class="size-[0.64rem]" @click="goLang">
              <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
          </div>
        </div>
      </template>
    </Top>

    <div class="icon">
      <img v-lazy="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ t('forget_pw.success') }}</div>

    <Button round color="var(--ex-primary-color)" class="submit" type="primary" @click="next">
      <span class="text-color text-[0.32rem] !font-normal">{{ t('forget_pw.back') }}</span></Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Icon } from "vant";
import router from "@/router";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";
import store from '@/store'
const { t } = useI18n()

const next = () => {
  store.dispatch('reset');
  router.replace({
    name: 'user',
  });
  setTimeout(()=>{
    store.commit('setIsLoginOpen', true);
  },300)
};


//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

</script>

<style lang="less" scoped>
.page_register_success {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 0 0.32rem;

  .icon {
    width: 2.22rem;
    height: 1.756rem;
    margin-top: 1.7rem;
    margin-bottom: 0.32rem;
  }

  .title {
    color: var(--ex-text-color);
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
    margin-bottom: 0.68rem;
  }

  .submit {
    width: 3.6rem;
    height: 0.9rem;
  }

}
</style>
