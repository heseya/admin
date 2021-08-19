<template>
  <validation-observer v-slot="{ handleSubmit }">
    <card>
      <br />
      <validated-input rules="required" v-model="form.name" label="Nazwa" />
      <br />
      <br />
      <validated-input rules="required" v-model="form.description" label="Opis" />
      <br />
      <permissions-manager v-model="form.permissions" />
      <br />
      <vs-button color="dark" size="large" @click="handleSubmit(submit)"> Zapisz </vs-button>
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
