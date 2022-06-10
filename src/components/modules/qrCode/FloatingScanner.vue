<template>
  <div>
    <button class="open-scanner-btn" @click="isOpen = true">
      <i class="bx bx-qr-scan"></i>
    </button>

    <a-modal v-model="isOpen" width="600px" :footer="null">
      <scanner @scan="handleScan" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { QrCodeObject, QrCodePayload } from '@/interfaces/QrCode'
import Vue from 'vue'
import Scanner from './Scanner.vue'
export default Vue.extend({
  components: { Scanner },

  data: () => ({
    isOpen: false,
  }),

  methods: {
    handleScan(data: QrCodePayload) {
      if (data.typ === QrCodeObject.Order) {
        this.$router.push({ name: 'OrdersView', params: { id: data.body.id } })
        this.isOpen = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.open-scanner-btn {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  right: 32px;
  bottom: 80px;
  width: 64px;
  height: 64px;
  font-size: 2em;
  color: $primary-color-500;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: $shadow;
  cursor: pointer;
  transition: 0.2s;

  @media ($viewport-11) {
    bottom: 32px;
  }

  &:hover {
    background-color: $primary-color-500;
    color: #fff;
  }
}
</style>
