<template>
  <textarea v-model="formValue" class="textarea" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    formValue: {
      get(): string {
        return this.value
      },
      set(val: string) {
        this.$emit('input', val)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.textarea {
  width: 100%;
  background-color: #fff;
  border: solid 1px #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 7px 13px;
  font-family: $primaryFont;
  transition: 0.3s;
  min-height: 100px;
  height: 200px;
  max-height: 400px;
  resize: vertical;

  &:focus {
    outline: none;
  }
}
</style>
