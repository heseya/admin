<template>
  <a-popover v-model="visible" :placement="placement" :trigger="trigger">
    <slot></slot>

    <template #content>
      <div class="pop-confirm">
        <p>{{ title }}</p>
        <footer>
          <app-button :type="okColor" size="small" @click="confirm">
            {{ okText }}
          </app-button>
          <app-button size="small" @click="cancel">
            {{ cancelText }}
          </app-button>
        </footer>
      </div>
    </template>
  </a-popover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PopConfirm',
  props: {
    title: {
      type: String,
      default: 'Jesteś pewny?',
    },
    okText: {
      type: String,
      default: 'Tak',
    },
    okColor: {
      type: String,
      default: 'danger',
    },
    cancelText: {
      type: String,
      default: 'Nie',
    },
    placement: {
      type: String,
      default: 'top',
    },
    trigger: {
      type: String,
      default: 'click',
    },
  },
  data: () => ({
    visible: false,
  }),
  methods: {
    close() {
      this.visible = false
    },
    confirm() {
      this.$emit('confirm')
      this.close()
    },
    cancel() {
      this.$emit('cancel')
      this.close()
    },
  },
})
</script>

<style lang="scss" scoped>
.pop-confirm {
  max-width: 300px;

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
