<template>
  <div class="textarea">
    <label class="textarea__label">{{ label }}</label>
    <textarea v-model="formValue" class="textarea__input" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
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
  &__label {
    display: block;
    font-size: 0.8em;
    color: var(--gray-color-600);
    margin-bottom: 2px;
  }

  &__input {
    width: 100%;
    background-color: var(--white-color);
    border: solid 1px var(--gray-color-300);
    border-radius: 4px;
    box-sizing: border-box;
    padding: 7px 13px;
    font-family: $primaryFont;
    transition: 0.3s;
    min-height: 40px;
    height: 60px;
    max-height: 400px;
    resize: vertical;

    &:focus {
      outline: none;
    }
  }
}
</style>
