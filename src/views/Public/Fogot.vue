<!-- 忘记密码 -->
<template>
  <div v-if="changePassSuccess">
    <ForgotSuccess />
  </div>
  <div v-else class="page page-fogot">
    <!-- 返回和语言 -->
    <Top :backFunc="goBack">
      <template #right>
        <div class="flex gap-1">
          <div class="size-[0.64rem]" @click="goLang">
              <img v-lazy="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
          </div>
        </div>
      </template>
    </Top>

    <div v-if="step == 1">
        <!-- 标题 -->
      <div class="title_box">
        <div class="title">{{ t('forget_pw.title') }}</div>
      </div>

      <!-- 表单 -->
      <div class="form relative">
        <!-- <div class="form_title">{{ t('forget_pw.email_phone') }}</div> -->
        <div class="form_item margin_item transition" :style="{borderColor: idError ? 'var(--ex-error-color)' : ''}">
          <input maxlength="32" v-model.trim="form.username" :placeholder="t('邮箱/手机号')" type="text"
            class="item_input" @focus="idError = false"/>
          <div class="form_item_clear" v-show="form.username" @click="form.username = null">
            <div class="size-[0.25rem]">
              <img v-lazy="getStaticImgUrl('static/img/common/mini_close.svg')" alt="" />
            </div>
          </div>
        </div>

        <!-- <div class="form_title">{{ t('change_login_pw.new_pw') }}</div> -->
        <div class="form_item mb-[0.05rem] transition" :style="{borderColor: newError ? 'var(--ex-error-color)' : ''}">
          <input maxlength="20" v-model.trim="form.password" :type="showPass ? 'text' : 'password'"
            :placeholder="t('change_login_pw.new_pw_placeholder')" class="item_input" @input="checkPasswordStrength" @focus="newError = false"/>
          <div class="form_item_icon" @click="toggleShowPass">
            <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'">
              <img v-if="showPass" v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
              <img v-else v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
            </div>
          </div>
        </div>
        <PasswordLevel class="form_passCheck" :password="form.password" :from="'forgot'" />

        <div class="mb-[0.32rem]"></div>
        <!-- <div class="form_title">{{ t('change_login_pw.confirm_pw') }}</div> -->
        <div class="form_item transition" :style="{borderColor: confirmError ? 'var(--ex-error-color)' : ''}">
          <input maxlength="20" v-model.trim="form.confirmPassword" :type="showConfirmPass ? 'text' : 'password'"
            :placeholder="t('change_login_pw.confirm_pw_placeholder')" class="item_input" @focus="confirmError = false"/>
          <div class="form_item_icon" @click="toggleShowConfirmPass">
            <div :class="showConfirmPass ? 'eye-show-icon' : 'eye-hidden-icon'">
              <img v-if="showConfirmPass" v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
              <img v-else v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="submit_box" @click="submit">
        <Button :loading="loading" round color="var(--ex-primary-color)" class="submit"
          type="primary"><span style="color: var(--ex-white);">{{ t('forget_pw.get_back') }}</span></Button>
      </div>
      <div class="tologin" @click="router.push({ name: 'login' })">{{ t('register.go_login') }}</div>
    </div>
    
    <CodeCheck :loading="loading" :type="verifyType" :value="form.username" @submit="submitForm" v-else-if="step == 2" />

    <BottomPopup title="验证方式" round closeable v-model:show="showVerifyType" position="bottom" teleport="body">
      <SelectVerifyType  @confirm="selectVerifyTypeConfirm" />
    </BottomPopup>

  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Icon, Button, showToast } from "vant";
import { ref, computed } from "vue";
import router from "@/router";
import { _forgetpw } from "@/api/api";
import CodeCheck from "@/components/CodeCheck.vue";
import store from "@/store";
import BottomPopup from "@/components/BottomPopup.vue";
import PasswordLevel from "@/components/PasswordLevel.vue";
import { useRoute } from "vue-router";
import ForgotSuccess from "./ForgotSuccess.vue";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";
import SelectVerifyType from '@/components/SelectVerifyType.vue'

const { t } = useI18n();
const step = ref(1)

// Refs and Variables
const verifyType = ref('google')
const showVerifyType = ref(false);
const showPass = ref(false);
const showConfirmPass = ref(false);
const svgColor = ref("var(--ex-border-color2)");
const loading = ref(false);
const idError = ref(false);
const newError = ref(false);
const confirmError = ref(false);

const selectVerifyTypeConfirm = (type)=>{
  verifyType.value = type
  showVerifyType.value = false
  step.value = 2
}
// Form data
const form = ref({
  username: "",
  password: "",
  confirmPassword: "",
});

// Disable button conditionally
const disabled = computed(() => {
  return !(
    form.value.username &&
    form.value.password &&
    form.value.password === form.value.confirmPassword
  );
});

// Toggle password visibility
const toggleShowPass = () => {
  showPass.value = !showPass.value;
};

const toggleShowConfirmPass = () => {
  showConfirmPass.value = !showConfirmPass.value;
};


// Submit form to trigger Google Verification
const submit = () => {
  if (!form.value.username || !form.value.password || !form.value.confirmPassword) {
    if (!form.value.username) idError.value = true;
    if (!form.value.password) newError.value = true;
    if (!form.value.confirmPassword) confirmError.value = true;
    return;
  }
  if (form.value.password != form.value.confirmPassword) {
    newError.value = true;
    confirmError.value = true;
    return;
  }
  showVerifyType.value = true
};

// Check password strength logic
const checkPasswordStrength = () => {
  const password = form.value.password;
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    svgColor.value = "green";
  } else if (password.length >= 6) {
    svgColor.value = "orange";
  } else {
    svgColor.value = "var(--ex-border-color2)";
  }
};
const route = useRoute();
const goBack = () => {
  if (step.value == 2) {
    step.value = 1
  } else {
    router.back();
  }
};

const goChat = () => {
  router.push({ name: "chat" });
};
const goLang = () => {
  router.push({ name: "language" });
};
// 提交用户信息
const changePassSuccess = ref(false);
const submitForm = (code) => {
  if (loading.value) return;
  loading.value = true;
  const data = {
    ...form.value
  }
  verifyType.value == 'google' ? data.googlecode = code : data.emailcode = code
  _forgetpw(data)
    .then((res) => {
      showToast("密码找回成功");
      changePassSuccess.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="less" scoped>
.page-fogot {
  padding-top: 0.88rem;

  .title_box {
    padding: 0.4rem 0.32rem 0.8rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: var(--ex-text-color);
      font-family: "PingFang SC";
      font-size: 0.4rem;
      font-style: normal;
      font-weight: 600;
      line-height: 140%;
      /* 39.2px */
    }

  }

  .tologin {
    color: var(--ex-primary-color);
    font-family: "PingFang SC";
    font-size: 0.32rem;
    font-style: normal;
    width: 100%;
    text-align: center;
  }

  .form {
    padding: 0 0.32rem;

    .form_title {
      color: var(--ex-text-color);
      line-height: 0.42rem;
      font-weight: 400;
      margin-bottom: 0.12rem;
      font-size: 0.28rem;
    }

    .form_passCheck {
      width: 2.32rem;
      height: 0.06rem;
      margin: 0.14rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      background-color: var(--ex-bg-color6);
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.2rem;
      border-width: 0.02rem;

      .item_input {
        flex: 1;
        color: var(--ex-text-color);
        font-weight: 400;
        font-size: 0.28rem;
      }

      &:has(.item_input:focus) {
        border: 0.02rem solid var(--ex-primary-color);
      }

      .form_item_user {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.32rem;
      }

      .form_item_icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-left: 0.2rem;
      }

      .form_item_clear {
        justify-content: center;
        color: var(--ex-text-color);
        margin-left: 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.32rem;
        height: 0.32rem;
        background-color: var(--ex-bg-color6);
        padding: 0.02rem;
        border-radius: 50%;

        .van-icon {
          font-size: 0.24rem;
        }
      }
    }

    .margin_item {
      margin-bottom: 0.4rem;
    }
  }

  .submit_box {
    padding: 0 0.32rem;
    margin-top: 0.8rem;
    margin-bottom: 0.6rem;

    .submit {
      width: 100%;
      height: 1.12rem;
      font-size: 0.36rem;
      border-radius: 0.6rem;
    }
  }

  .go_register {
    margin: 2.8rem 0 1.4rem 0;
    text-align: center;
    font-weight: 400;

    >span {
      color: var(--ex-primary-color);
      font-weight: 600;
    }
  }
}

.eye-hidden-icon {
  width: 0.4rem;
  height: 0.32rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.eye-show-icon {
  width: 0.4rem;
  height: 0.26rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
