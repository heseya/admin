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
      <switch-input v-model="form.is_registration_role" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.isRegistrationRole') }}
          <info-tooltip> {{ $t('form.isRegistrationRoleTooltip') }}</info-tooltip>
        </template>
      </switch-input>
      <switch-input v-model="form.is_joinable" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.isJoinableRole') }}
          <info-tooltip> {{ $t('form.isJoinableRoleTooltip') }}</info-tooltip>
        </template>
      </switch-input>
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

<i18n lang="json">
{
  "pl": {
    "form": {
      "isRegistrationRole": "Czy można zarejestrować się z tą rolą?",
      "isRegistrationRoleTooltip": "Jeśli zaznaczone, użytkownicy po zarejestrowaniu będą mogli przypisać sobie tę rolę.",
      "isJoinableRole": "Czy można dołączyć do tej roli?",
      "isJoinableRoleTooltip": "Jeśli zaznaczone, użytkownicy będą mogli przypisać sobie tę rolę po dołączeniu."
    }
  },
  "en": {
    "form": {
      "isRegistrationRole": "Can register with this role?",
      "isRegistrationRoleTooltip": "If checked, users will be able to assign themselves this role after registration.",
      "isJoinableRole": "Can join to this role?",
      "isJoinableRoleTooltip": "If checked, users will be able to assign themselves this role after joining."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { RoleCreateDto } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import PermissionsManager from './PermissionsManager.vue'

export default defineComponent({
  components: { ValidationObserver, Card, PermissionsManager },
  props: {
    value: {
      type: Object as PropType<RoleCreateDto>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): RoleCreateDto {
        return this.value
      },
      set(v: RoleCreateDto) {
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
