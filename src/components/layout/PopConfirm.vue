<template>
  <vs-tooltip bottom shadow not-hover :value="visible" @input="setVisible">
    <slot :open="open" :close="close" :toggle="toggle"></slot>
    <template #tooltip>
      <div class="content-tooltip">
        <p>{{ title }}</p>
        <footer>
          <app-button type="danger" size="small" @click="confirm">
            {{ okText }}
          </app-button>
          <app-button size="small" @click="cancel">
            {{ cancelText }}
          </app-button>
        </footer>
      </div>
    </template>
  </vs-tooltip>
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
    cancelText: {
      type: String,
      default: 'Nie',
    },
  },
  data: () => ({
    visible: false,
  }),
  methods: {
    setVisible(newValue: boolean) {
      this.visible = !!newValue
    },
    open() {
      this.setVisible(true)
    },
    close() {
      this.setVisible(false)
    },
    toggle() {
      this.setVisible(!this.visible)
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
.content-tooltip {
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
