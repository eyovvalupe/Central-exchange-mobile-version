<!-- 验证码校验 -->
<template>

  <div class="code_check_box">
   
    <div class="title">
      {{ titleMap[props.type] }}
    </div>
    <div class="info flex flex-col">
      <div class="flex mb-[0.6rem] text-[0.28rem]" v-if="type == 'email'">
        <span>{{ $t("register.code_con1") }}</span>
        <span>{{ t('register.email')}}</span>
      </div>
      <div class="h-[0.4rem] mb-[0.6rem]" v-else></div>
      <div class="flex flex-row justify-between items-center mb-[0.6rem]" >
        <span class="text-[0.32rem] text-color !font-normal">{{ type == 'email' ? $t('safety.verify_code_msg') : $t('register.code_con2') }}</span>
        <div class="timer_container" @click="send" v-if="type == 'email'">
          {{ s ? s + "s" : t('register.code_again') }}
        </div>
      </div>
    </div>
    <div class="w-full px-[0.32rem] mb-[0.4rem]">
      <CodeInput from="register" :loading="loading" :btnText="$t('withdraw.confirm')" @submit="submit" />
    </div>
     <!-- 验证码 -->
     <VerifCode :type="type" :value="value" @submit="submitCode" to="body"
      ref="verifCodeRef" />

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _emailcode } from '@/api/api'
import CodeInput from "./CodeInput.vue";
import { useI18n } from "vue-i18n";
import store from '@/store'
import VerifCode from "@/components/VerifCode.vue";
const { t } = useI18n();

const verifcode = ref("");
const verifCodeRef = ref();
const props = defineProps({
  type: {
    type: String,
    default: "google",
  },
  value: {
    type: String,
    default: "",
  },
  loading:Boolean
});
const titleMap = ref({
  email: t("safety.email_verify"),
  google: t("user_page.google_verification"),
});

const emit = defineEmits(["submit"]);
let timeInterval = null;

const open = () => {
  s.value = 0;
  timeInterval && clearInterval(timeInterval);
};

const submit = (code) => {
  emit('submit',code);
}

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')


const s = ref(0);
const start = ()=>{
  s.value = 119;
  timeInterval = setInterval(() => {
    s.value--;
    if (s.value == 0) {
      clearInterval(timeInterval);
    }
  }, 1000);
}
const send = async () => {
  if (s.value) return;
  if(props.type == 'email'){
    await store.dispatch("updateSessionToken")
    _emailcode({
      email:props.value,
      token:sessionToken.value,
      verifcode:verifcode.value || ''
    }).then(()=>{
      start()
    }).catch((err)=>{
      if(err.code == 1001){
        verifCodeRef.value.open();
      }
    })
    verifcode.value = ''
  }else{
    start()
  }
};

open();

// 通过验证码提交
const submitCode = (code) => {
  verifcode.value = code;
  send();
};

onMounted(() => {
  if(props.type == 'email'){
    send();
  }
});
onBeforeUnmount(()=>{
  if(timeInterval){
    clearInterval(timeInterval)
  }
})
</script>

<style lang="less" scoped>
.code_check_box {
  position: relative;

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

    .top_back_container {
      .arrow_icon {
        width: 0.4rem;
        height: 0.4rem;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: var(--ex-text-color);
      }
    }

    .server_icon {
      width: 0.72rem;
      height: 0.72rem;
      border-width: 0.02rem;
      border-radius: 0.36rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-color: var(--ex-border-color);
      margin-right: 0.12rem;

      .chat_icon {
        width: 0.432rem;
        height: 0.432rem;
      }
    }

    .language_icon_container {
      width: 0.72rem;
      height: 0.72rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-width: 0.02rem;
      border-color: var(--ex-border-color);
      border-radius: 0.36rem;

      .language_icon {
        width: 0.432rem;
        height: 0.432rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}

.jump {
  display: flex;
  justify-content: center;
  color: var(--ex-text-color);
  font-size: 0.32rem;
  span{
    padding: 0.2rem;
  }
}

.title {
  padding: 0.48rem 0.32rem 0.24rem 0.32rem;
  font-weight: 600;
  color: var(--ex-text-color);
  font-size: 0.4rem;
  width: 100%;
  // padding: 2rem 0 0.4rem 0;
}

.info {
  padding: 0 0.32rem;
  line-height: 0.5rem;
  color: var(--ex-text-color5);

  span {
    font-weight: bold;
  }
}

.ipt_box {
  :deep(.van-password-input__item) {
    border: 0.02rem solid var(--ex-border-color);
    background-color: var(--ex-bg-color);
    width: 1rem;
    height: 1.2rem;
    box-sizing: border-box;
    border-radius: 0.32rem;

    &:has(.van-password-input__cursor) {
      border: 0.02rem solid var(--ex-primary-color);
    }
  }
}

.send {
  color: var(--ex-primary-color);
  text-align: center;
  padding: 0.4rem 0;
  cursor: pointer;
}

.button_container {
  width: 6.86rem;
  height: 1.12rem;
  background-color: var(--ex-primary-color);
  border-radius: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.3rem;
  color: var(--ex-text-color--bg-primary);
  margin-bottom: 0.6rem;
}

.timer_container {
  width: 2.08rem;
  height: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ex-border-color2);
  border-radius: 1rem;
  color: var(--ex-primary-color);
  font-size: 0.3rem;
}
</style>
