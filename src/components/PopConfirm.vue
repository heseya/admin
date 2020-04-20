<template>
  <vs-tooltip bottom shadow not-hover :value="value" @input="setValue">
    <slot></slot>
    <template #tooltip>
      <div class="content-tooltip">
        <p>{{title}}</p>
        <footer>
          <vs-button @click="confirm" danger block>
            {{okText}}
          </vs-button>
          <vs-button @click="cancel" transparent dark block>
            {{cancelText}}
          </vs-button>
        </footer>
      </div>
    </template>
  </vs-tooltip>
</template>

<script>
export default {
  name: 'PopConfirm',
  props: {
    value: {
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
    setValue (newValue) {
      this.$emit('input', !!newValue)
    },
    confirm () {
      this.$emit('confirm')
      this.setValue(false)
    },
    cancel () {
      this.$emit('cancel')
      this.setValue(false)
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
