<template>
  <vs-tooltip bottom shadow not-hover :value="visible" @input="setVisible">
    <slot :open="open" :close="close" :toggle="toggle"></slot>
    <template #tooltip>
      <div class="content-tooltip">
        <p>{{ title }}</p>
        <footer>
          <vs-button @click="confirm" danger block>
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

<script>
export default {
  name: 'PopConfirm',
  data: () => ({
    visible: false
  }),
  props: {
    value: {
      // ! DEPRECATED
      // Is popConfirm visible?
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Jesteś pewny?'
    },
    okText: {
      type: String,
      default: 'Tak'
    },
    cancelText: {
      type: String,
      default: 'Nie'
    }
  },
  methods: {
    setVisible(newValue) {
      this.$emit('input', !!newValue) // ! DEPRECATED
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
    }
  },
  watch: {
    value(v) {
      // ! DEPRECATED
      // Added for compatibility support only
      this.visible = v
    }
  }
}
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
