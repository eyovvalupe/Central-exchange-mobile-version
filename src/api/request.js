import axios from 'axios';
import { showToast } from 'vant';
import store from '@/store/index';
import router from '@/router/index';
import { BASE_ADDRESS } from '@/config';
import i18n from '../i18';
const { t } = i18n.global;
const instance = axios.create({
  //baseURL: process.env.NODE_ENV === 'development' ? "/api" : BASE_ADDRESS,
  baseURL: BASE_ADDRESS,
  timeout: 15000,
  transformRequest: [
    function (data, headers) {
      if (headers['Content-Type'] == 'multipart/form-data') return data;
      return JSON.stringify(data);
    },
  ],
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.sslVerify = false;
    // config.headers["deviceId"] = store.state.deviceId;
    const { token } = store.state;
    if (token) {
      config.headers.auth = token;
    }
    if (config?.custom?.auth && !token) {
      // router.replace({
      //   name: 'login',
      //   query: {
      //     reurl: router.currentRoute.value.name
      //   }
      // })
      router.replace({
        name: 'home',
      });
      store.commit('setIsLoginOpen', true);
      console.error(config);
      throw {
        message: t('common.token_invalid'),
      };
      return;
    }
    config.headers.lang = 'en_US';
    config.headers['Content-Type'] = 'application/json';
    if (config && config.custom && config.custom['Content-Type']) {
      config.headers['Content-Type'] = config.custom['Content-Type'];
    }
    if (config && config.custom && config.custom.responseType) {
      config.headers.responseType = config.custom.responseType;
    }
    // console.log(`--- 请求 ${config.url} 参数 ---`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // console.log(`--- 请求 ${response.config.url} 返回 ---`, response.data);
    const res = response.data;
    const custom = response.config?.custom;
    if (res.code != 200) {
      if (res.code == 1101) {
        res.message = t('register.user_already_exist');
      } else if (res.code == 1102) {
        res.message = t('register.invite_code_error');
      } else if (res.code == 400) {
        switch (response.config.url) {
          case '/anon/v1/user/login':
            res.message = t('login.username_password_error');
            break;
          case '/authc/v1/user/emailbind':
            res.message = t('common.verification_code_error');
            break;
          case '/anon/v1/user/forget':
            res.message = t('common.verification_code_error');
            break;
          case '/authc/v1/user/safeword':
            res.message = t('common.verification_code_error');
            break;
          default:
            res.message = t('common.operation_error');
        }
      } else if (res.code == 401) {
        res.message = t('common.login_first');
        if (custom.toast) {
          setTimeout(() => {
            showToast(res.message);
          }, 600);
        }
        if (location.href.includes('/login')) {
          return Promise.reject(res);
        }
        store.dispatch('reset');
        router.replace({
          name: 'home',
        });
        store.commit('setIsLoginOpen', true);
        return Promise.reject(res);
      }

      if (
        res.message == 'fund_password_wrong' ||
        res.message == 'Wrong fund password'
      ) {
        res.message = t('common.trade_pw_error');
      }

      if (custom.toast) {
        setTimeout(() => {
          if (res.code == 1010 || res.code == 1001) reurn;
          showToast(res.message || t('common.server_error'));
        }, 600);
      }
      return Promise.reject(res);
    }

    return res;
  },
  async function (error) {
    if (error?.config?.custom?.retry) {
      if (!error.config) return Promise.reject(error);
      error.config._retryTimes = error.config._retryTimes
        ? error.config._retryTimes + 1
        : 1;
      if (error.config._retryTimes > 3) return Promise.reject(error); // 重试3次
      try {
        error.config.data = JSON.parse(error.config.data);
      } catch {}
      return instance(error.config);
    }
    showToast(error.message || t('common.network_error'));
    return Promise.reject(error);
  },
);

export default instance;
