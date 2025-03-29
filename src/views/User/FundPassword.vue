<!-- 修改交易密码 -->
<template>
  <div class="page page-loginpass">
    <Top :title="t('change_trade_pw.page_title')" :backFunc="goBack" />

    <!-- 表单 -->
    <div v-if="step == 1">
      <div class="form">
        <div class="form_item margin_item mb-[0.05rem] transition"
          :style="{ borderColor: newError ? 'var(--ex-error-color)' : '' }">
          <input maxlength="20" v-model.trim="form.password" :type="showPass ? 'text' : 'password'" class="item_input"
            :placeholder="$t('新交易密码')" @focus="newError = false" />
          <div class="form_item_icon" @click="showPass = !showPass">
            <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'">
              <img v-if="showPass" v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="" />
              <img v-else v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="" />
            </div>
          </div>
        </div>
        <!-- 密码等级 -->
        <PasswordLevel style="position: relative; top: -0.25rem; left: 0.32rem" :password="form.password" />

        <div class="form_item margin_item transition"
          :style="{ borderColor: confirmError ? 'var(--ex-error-color)' : '' }">
          <input maxlength="20" v-model.trim="form.password2" :type="showPass2 ? 'text' : 'password'" class="item_input"
            :placeholder="$t('确认新交易密码')" @focus="confirmError = false" />
          <div class="form_item_icon" @click="showPass2 = !showPass2">
            <div :class="showPass2 ? 'eye-show-icon' : 'eye-hidden-icon'">
              <img v-if="showPass2" v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="" />
              <img v-else v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="" />
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="submit_box">
        <Button :loading="loading" round color="var(--ex-primary-color)" class="submit ripple-btn" type="primary"
          @click="submit"><span style="color: var(--ex-white)">{{
            $t('change_trade_pw.btn')
          }}</span></Button>
      </div>
    </div>

    <CodeCheck :loading="loading" :type="verifyType" :value="userInfo.username" @submit="submitForm" v-else-if="step == 2" />


    <BottomPopup title="验证方式" round closeable v-model:show="showVerifyType" position="bottom" teleport="body">
      <SelectVerifyType  @confirm="selectVerifyTypeConfirm" />
    </BottomPopup>

    <!-- 谷歌 -->
    <GoogleVerfCode @submit="submitForm" ref="ggRef" />
    <AccountCheck :from="'safety'" ref="accountCheckRef" />
  </div>
</template>

<script setup>
import { Button, showToast } from 'vant';
import { ref, computed } from 'vue';
import router from '@/router';
import { _safeword, _login } from '@/api/api';
import Top from '@/components/Top.vue';
import GoogleVerfCode from '@/components/GoogleVerfCode.vue';
import PasswordLevel from '@/components/PasswordLevel.vue';
import AccountCheck from '@/components/AccountCheck.vue';
import BottomPopup from '../../components/BottomPopup.vue';
import SelectVerifyType from '@/components/SelectVerifyType.vue'
import CodeCheck from "@/components/CodeCheck.vue";
import store from '@/store'
import { getStaticImgUrl } from '@/utils/index.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const ggRef = ref();
const step  = ref(1)
const verifyType = ref('google')
const showVerifyType = ref(false);
const showPass = ref(false); // 密码显示
const showPass2 = ref(false);
const newError = ref(false);
const confirmError = ref(false);
const accountCheckRef = ref();
const userInfo = computed(()=> store.state.userInfo)

const form = ref({
  // 表单
  prevPassword: '',
  password: '',
  password2: '',
});

const goBack = () => {
  if (step.value == 2) {
    step.value = 1
  } else {
    router.back();
  }
};

const loading = ref(false); // 加载
const submit = () => {
  //if (accountCheckRef.value.check()) {
    if (
      !form.value.password ||
      !form.value.password2
    ) {
      if (!form.value.password) newError.value = true;
      if (!form.value.password2) confirmError.value = true;
      return;
    }
    if (form.value.password != form.value.password2) {
      showToast(t('change_login_pw.no_match_noti'));
      newError.value = true;
      confirmError.value = true;
    } else {
      showVerifyType.value = true
    }
  //}
};
const submitForm = (code) => {
  const params = {
    safeword: form.value.password,
  };
  if(verifyType.value == 'google'){
    params.googlecode = code
  }else{
    params.emailcode = code
  }
  
  if (loading.value) return;
  loading.value = true;
  _safeword(params)
    .then((res) => {
      if (res.code == 200) {
        // store.commit('setSuccessToastText', t('safety.success_title'));
        // store.commit('setShowSuccessToast', true);
        setTimeout(() => {
          router.replace({
            name: 'success',
          });
        }, 1000);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const selectVerifyTypeConfirm = (type)=>{
  verifyType.value = type
  showVerifyType.value = false
  step.value = 2
}

</script>

<style lang="less" scoped>
.page-loginpass {
  padding-top: 1.52rem;

  .form {
    padding-inline: 0.32rem;
    padding-bottom: 0.1rem;

    .form_title {
      color: var(--ex-text-color);
      line-height: 0.42rem;
      font-weight: 400;
      font-size: 0.28rem;
      margin-bottom: 0.1rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;
      background-color: var(--ex-bg-color5);
      justify-content: space-between;
      border-width: 0.02rem;

      .item_input {
        flex: 1;
        color: var(--ex-text-color);
        font-weight: 400;
        font-size: 0.32rem;
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
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .margin_item {
      margin-bottom: 0.4rem;
    }
  }

  .submit_box {
    padding: 0 0.32rem;

    .submit {
      width: 100%;
      height: 1.12rem;
      font-size: 0.36rem;
      border-radius: 0.8rem;
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
