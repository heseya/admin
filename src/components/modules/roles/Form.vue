<template>
  <validation-observer v-slot="{ handleSubmit }">
    <card>
      <br />
      <validated-input v-model="form.name" rules="required" label="Nazwa" :disabled="disabled" />
      <br />
      <br />
      <validated-input v-model="form.description" label="Opis" :disabled="disabled" />
      <br />
      <permissions-manager v-model="form.permissions" :disabled="disabled" />
      <br />
      <vs-button v-if="!disabled" color="dark" size="large" @click="handleSubmit(submit)">
        Zapisz
      </vs-button>
    </card>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import ValidatedInput from '@/components/form/ValidatedInput.vue'
import Card from '@/components/layout/Card.vue'
import PermissionsManager from './PermissionsManager.vue'

import { RoleDTO } from '@/interfaces/Role'

export default Vue.extend({
  components: { ValidationObserver, ValidatedInput, Card, PermissionsManager },
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
