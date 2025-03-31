<!-- 验证码校验 -->
<template>

  <div class="code_check_box">
    <!-- 返回和语言 -->
    <Top>
      <template #right>
        <div class="flex gap-1">
          <div class="server_icon" @click="goChat">
            <img v-lazy="getStaticImgUrl('/static/img/user/server.svg')" />
          </div>

          <div class="language_icon_container" @click="goLang">
            <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
          </div>
        </div>
      </template>
    </Top>
    <div class="title">
      {{ titleMap[props.type] }}{{ $t("register.code_verify") }}
    </div>
    <div class="info flex flex-col">
      <div class="flex mb-[0.8rem] text-[0.28rem]">
        <span>{{ $t("register.code_con1", {
          method: props.type == "email" ?
            t('register.email') : t('register.phone')
        }) }}</span>
      </div>
      <div class="flex flex-row justify-between items-center mb-[0.6rem]">
        <span class="text-[0.32rem] text-color !font-normal">{{ $t('register.code_con2') }}</span>
        <div class="timer_container" @click="send">
          {{ s ? s + "s" : t('register.code_again') }}
        </div>
      </div>
    </div>
    <div class="w-full px-[0.32rem] mb-[0.4rem]">
      <CodeInput :loading="loading" :from="'register'" @submit="submit" />
    </div>
    <div class="jump"><span @click="close">{{ $t("register.code_jump") }}</span></div>
    <BottomPopup round closeable v-model:show="confirmRef" position="bottom" teleport="body">
      <div class="w-full h-[4rem] flex flex-col items-center">
        <div class="text-[0.36rem] mb-[0.64rem]">{{ t("register.code_jump") }}</div>
        <div class="text-[0.32rem] mb-[1rem]">
          {{ t('register.code_jump_title') }}
        </div>
        <div class="w-full flex justify-between px-[0.4rem]">
          <div
            class="w-[3.16rem] h-[0.8rem] rounded-[1.3rem] bg-white1 text-color flex items-center justify-center text-[0.32rem] font-[600] ripple-primary"
            @click="confirmRef = false">{{ t('google_auth.google_input_btn_cancel') }}</div>
          <div
            class="w-[3.16rem] h-[0.8rem] rounded-[1.3rem] bg-primary text-color flex items-center justify-center text-[0.32rem] font-[600] ripple-btn"
            @click="next">{{ t('google_auth.google_input_btn_confirm') }}</div>
        </div>
      </div>
    </BottomPopup>
    <!-- 验证码 -->
    <VerifCode :type="type" :value="value" @submit="submitCode" to="body" ref="verifCodeRef" />

  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, onMounted, onBeforeUnmount } from "vue";
import router from "@/router";
import CodeInput from "./CodeInput.vue";
import { useI18n } from "vue-i18n";
import Top from "./Top.vue";
import BottomPopup from "./BottomPopup.vue";
import { _emailcode } from '@/api/api'
import store from '@/store'
import VerifCode from "@/components/VerifCode.vue";

const verifcode = ref("");
const verifCodeRef = ref();
const { t } = useI18n();

const props = defineProps({
  type: {
    type: String,
    default: "phone",
  },
  value: {
    type: String,
    default: "",
  },
  loading: Boolean
});
const titleMap = ref({
  email: t("register.code_email"),
  phone: t("register.code_phone"),
});

const emit = defineEmits(["success", "submit"]);

const confirmRef = ref(false);

const open = () => {
  s.value = 0;
  timeInterval && clearInterval(timeInterval);
};

const close = () => {
  confirmRef.value = true;
};

const next = () => {
  emit('success');
  s.value = 0;
  timeInterval && clearInterval(timeInterval);
}

const submit = (code) => {
  emit('submit', code)
}

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')

let timeInterval = null;
const s = ref(0);
const start = () => {
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
  if (props.type == 'email') {
    await store.dispatch("updateSessionToken")
    _emailcode({
      email: props.value,
      token: sessionToken.value,
      verifcode: verifcode.value || ''
    }).then(() => {
      start()
    }).catch((err) => {
      if (err.code == 1001) {
        verifCodeRef.value.open();
      }
    })
    verifcode.value = ''
  } else {
    start()
  }
};

open();

// 通过验证码提交
const submitCode = (code) => {
  verifcode.value = code;
  send();
};


//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

const goChat = () => {
  router.push({ name: "chat" });
};

onMounted(() => {
  send();
});

onBeforeUnmount(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

</script>

<style lang="less" scoped>
.code_check_box {
  position: relative;

  .server_icon {
    width: 0.64rem;
    height: 0.64rem;
    border-width: 0.02rem;
    border-radius: 0.36rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-color: var(--ex-border-color);
    margin-right: 0.12rem;
  }

  .language_icon_container {
    width: 0.64rem;
    height: 0.64rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 0.02rem;
    border-color: var(--ex-border-color);
    border-radius: 0.36rem;
  }
}

.jump {
  display: flex;
  justify-content: center;
  color: var(--ex-text-color);
  font-size: 0.32rem;

  span {
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
