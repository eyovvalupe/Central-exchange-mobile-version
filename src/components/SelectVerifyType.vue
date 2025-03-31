<!-- 验证码校验 -->
<template>
  <div>
    <div class="px-[0.32rem] flex flex-col pt-[0.7rem] pb-[1.04rem] gap-[0.32rem]">
      <div class="h-[1.12rem]  rounded-full ripple-btn text-[0.32rem] flex items-center justify-center"
        :class="[verifyType == 'google' ? 'bg-primary' : 'bg-white1']" @click="confirm('google')">{{ t('safety.google_verify') }}</div>
      <div class="h-[1.12rem] rounded-full ripple-btn text-[0.32rem] flex items-center justify-center"
        :class="[verifyType == 'email' ? 'bg-primary' : 'bg-white1']" @click="confirm('email')">{{ t('safety.email_verify') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const  {t} = useI18n();

const emits = defineEmits(['confirm'])
const verifyType = ref('')

const confirm = (v) => {
  verifyType.value = v
  emits('confirm', v)
}
</script>

<style lang="less" scoped></style>
