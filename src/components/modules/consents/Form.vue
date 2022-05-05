<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <card>
        <validated-input
          v-model="form.name"
          rules="required"
          :label="$t('common.form.name')"
          :disabled="disabled"
        />
        <label class="app-input__label" :name="$t('common.form.description')">{{
          $t('common.form.description')
        }}</label>
        <rich-editor v-model="form.description_html" :disabled="disabled" />
        <br />
        <div class="switches">
          <switch-input v-model="form.required" :label="$t('common.form.required')" horizontal />
        </div>
        <br />
        <app-button v-if="!disabled" html-type="submit">
          {{ $t('common.save') }}
        </app-button>
      </card>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import Card from '@/components/layout/Card.vue'
import RichEditor from '@/components/form/RichEditor.vue'

import { ConsentDTO } from '@/interfaces/Consent'

export default Vue.extend({
  components: {
    ValidationObserver,
    Card,
    RichEditor,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ConsentDTO>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): ConsentDTO {
        return this.value
      },
      set(v: ConsentDTO) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style lang="scss" scoped>
.switches {
  display: flex;
}
</style>