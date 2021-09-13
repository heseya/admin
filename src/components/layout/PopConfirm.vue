<template>
  <vs-tooltip bottom shadow not-hover :value="visible" @input="setVisible">
    <slot :open="open" :close="close" :toggle="toggle"></slot>
    <template #tooltip>
      <div class="content-tooltip">
        <p>{{ title }}</p>
        <footer>
          <vs-button :color="okColor" block @click="confirm">
            {{ okText }}
          </vs-button>
          <vs-button @click="cancel" transparent dark block>
            {{ cancelText }}
          </vs-button>
        </footer>
      </div>
    </template>
  </vs-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PopConfirm',
  data: () => ({
    visible: false,
  }),
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
  },
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
    justify-content: center;
  }
}
</style>
