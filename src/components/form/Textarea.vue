<template>
  <div class="textarea">
    <textarea v-model="formValue" />
    <small>
      Markdown is supported
      <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">
        <i class="bx bx-info-circle"></i>
      </a>
    </small>
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
  textarea {
    width: 100%;
    background-color: #f4f7f8;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 7px 13px;
    padding-left: 10px;
    border: none;
    font-family: $primaryFont;
    transition: 0.3s;
    min-height: 100px;
    height: 200px;
    max-height: 400px;
    resize: vertical;

    &:focus {
      padding-left: 15px;
      outline: none;
    }
  }

  small {
    display: block;
    width: 100%;
    text-align: right;
    color: #333333;
    font-weight: 600;
    font-size: 0.7em;

    i {
      color: $primary-color-300;
    }
  }
}
</style>
