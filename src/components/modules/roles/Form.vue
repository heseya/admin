<template>
  <validation-observer v-slot="{ handleSubmit }">
    <card>
      <validated-input
        v-model="form.name"
        rules="required"
        :label="$t('common.form.name')"
        :disabled="disabled"
      />
      <validated-input
        v-model="form.description"
        :label="$t('common.form.description')"
        :disabled="disabled"
      />
      <br />
      <permissions-manager v-model="form.permissions" :disabled="disabled" />
      <br />
      <slot></slot>
      <br />
      <app-button v-if="!disabled" @click="handleSubmit(submit)">
        {{ $t('common.save') }}
      </app-button>
    </card>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import Card from '@/components/layout/Card.vue'
import PermissionsManager from './PermissionsManager.vue'

import { RoleDTO } from '@/interfaces/Role'

export default Vue.extend({
  components: { ValidationObserver, Card, PermissionsManager },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<RoleDTO>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): RoleDTO {
        return this.value
      },
      set(v: RoleDTO) {
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
