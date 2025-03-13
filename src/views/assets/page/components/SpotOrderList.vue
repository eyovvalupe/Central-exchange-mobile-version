<template>
  <div class="spot_order_list">
    <div class="crypto_order_tabs">
      <span
        class="crypto_order_tab mr-[0.6rem]"
        :class="activeTab == 0 ? 'actived' : ''"
        @click="changeActiveTab(0)"
        >{{ t("assets.order_current_position") }}</span
      >
      <span
        class="crypto_order_tab"
        :class="activeTab == 1 ? 'actived' : ''"
        @click="changeActiveTab(1)"
        >{{ t("assets.order_history") }}</span
      >
    </div>
    <div
      class="tab"
      :class="{ '!mt-[0]': from == 'order' }"
      v-if="activeTab == 0"
    >
      <div :class="type == 'modal' ? 'h-[11.4rem] overflow-auto' : type == 'full' ? 'h-[10.7rem] overflow-auto' : ''">
        <Positions :from="from" />
      </div>
    </div>
    <div
      class="tab"
      :class="{ '!mt-[0]': from == 'order' }"
      v-if="activeTab == 1"
    >
      <div :class="type == 'modal' ? 'h-[11.4rem] overflow-auto' : type == 'full' ? 'h-[10.7rem] overflow-auto' : ''">
        <Inquire
          :from="from"
          ref="InquireRef"
          scrollDom="#assets_order_center_body"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import Inquire from "@/views/Trade2/spot/Inquire.vue";
import Positions from "@/views/Trade2/spot/Positions.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  from: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
});

const { t } = useI18n();
const InquireRef = ref();
const activeTab = ref(0);
const changeActiveTab = (val) => {
  activeTab.value = val;
  if (val == 1) {
    setTimeout(() => {
      InquireRef.value && InquireRef.value.init();
    }, 0);
  }
};
</script>
<style lang="less">
.spot_order_list {
  .crypto_order_tabs {
    width: 100%;
    height: 0.52rem;
    border-bottom: 0.02rem solid var(--ex-bg-white2);

    .crypto_order_tab {
      font-size: 0.24rem;
      color: var(--ex-text-color2);
    }

    .actived {
      font-size: 0.32rem;
      font-weight: 600;
      color: var(--ex-text-color);
    }
  }

  .tab {
    .positions {
      padding: 0;
    }
    .inquire {
      padding: 0;
    }
  }
}
</style>
