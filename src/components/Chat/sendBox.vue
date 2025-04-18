<template>
  <div class="msg-input flex items-center">
    <span class="icon-left"><img v-lazy="getStaticImgUrl('/static/img/support/sendImg.svg')" />
      <input type="file" id="fileInput" @change="uploadImg" accept="image/*" />
    </span>
    <textarea class="textarea text-black" v-model="message" ref="sendInput"
      :placeholder="t('service.input_message')"></textarea>
    <span class="icon-right mask-btn" @click="sendMessage('text', message)"><img
        v-lazy="getStaticImgUrl('/static/img/support/send.svg')" />
    </span>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, ref } from "vue";
import { serviceChat } from "@/utils/serviceChat";
import { showToast } from "vant";
import { UPLOAD_ADDRESS, UPLOAD_TOKEN } from "@/config.js";
import { _fetchWithTimeout } from "@/api/upload";
import { randomFileName, _compressImg } from "@/utils";
import storeUser from "@/store";
import storeChat from "@/store/chat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["scrollToBottom"]);
const message = ref("");
const token = computed(() => storeUser.state.token);
const isConnected = computed(() => storeChat.state.isConnected);
const sendMessage = (type, content) => {
  if (!isConnected.value && message.value !== "") {
    showToast("网络错误,请稍等");
    return;
  }
  const obj = { type, nologinid: storeChat.getters.getNologinid, content };
  if (token.value) {
    obj.auth = token.value;
  }
  serviceChat.sendMessage("send", obj);
  message.value = "";
  emit("scrollToBottom");
};
const uploadImg = (event) => {
  const file = event.target.files[0];
  const fileName = randomFileName(file.name);
  const path = `images/${fileName}`;
  const apiUrl = `${UPLOAD_ADDRESS}${path}`;
  const reader = new FileReader();
  reader.onloadend = function () {
    let ratio = 0.5;
    const size = file.size / 1024;
    if (size < 50) {
      ratio = 1;
    } else if (size < 150) {
      ratio = 0.9;
    } else {
      ratio = 0.5;
    }
    _compressImg(reader.result, ratio, (base64Img) => {
      const base64result = base64Img.substr(base64Img.indexOf(",") + 1);
      _fetchWithTimeout(`${apiUrl}`, {
        method: "PUT",
        headers: {
          Authorization: UPLOAD_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: storeChat.getters.getNologinid,
          content: base64result,
          branch: "main",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.content && data.content.download_url) {
            sendMessage("img", data.content.download_url);
          } else {
            showToast("上传失败");
            console.error("上传失败:", data);
          }
        })
        .catch((error) => {
          showToast("上传出错");
          console.error("上传出错:", error);
        });
    });
  };
  reader.readAsDataURL(file);
};
</script>

<style lang="less">
.msg-input {
  height: 0.94rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;

  .textarea {
    width: 5.1rem;
    height: 0.94rem;
    line-height: 0.94rem;
    flex-shrink: 0;
    border-radius: 0.32rem;
    text-indent: 0.32rem;
    font-size: 0.3rem;
    border: 0.5px solid var(--ex-text-color2);
    overflow-y: hidden;
    background-color: var(--ex-bg-color2);
    color: var(--ex-text-white);
  }

  #fileInput {
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    z-index: 9;
    opacity: 0;
  }

  .icon-left,
  .icon-right {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 0.4rem;
    height: 0.4rem;

    img {
      max-height: 0.6rem;
      flex-shrink: 0;
      vertical-align: middle;
    }
  }

  .icon-right {
    img {
      max-height: 0.6rem;
      flex-shrink: 0;
      vertical-align: middle;
    }
  }
}
</style>
