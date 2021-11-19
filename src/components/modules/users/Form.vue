<template>
  <modal-form>
    <validated-input v-model="form.name" :disabled="disabled" rules="required" label="Nazwa" />

    <validated-input
      v-model="form.email"
      :disabled="disabled"
      rules="required|email"
      label="Email"
    />

    <validated-input
      v-if="isNewUser(form)"
      v-model="form.password"
      :disabled="disabled"
      type="password"
      rules="required|password"
      label="Hasło"
    />

    <app-select
      v-model="form.roles"
      :disabled="disabled"
      label="Role"
      mode="multiple"
      option-filter-prop="label"
    >
      <a-select-option
        v-for="role in roles"
        :key="role.id"
        :label="role.name"
        :disabled="!role.assignable"
      >
        {{ role.name }}
      </a-select-option>
    </app-select>
  </modal-form>
</template>

<script lang="ts">
import Vue from 'vue'

import ModalForm from '@/components/form/ModalForm.vue'

import { CreateUserDTO, EditUserDTO } from '@/interfaces/User'
import { Role } from '@/interfaces/Role'

export default Vue.extend({
  components: {
    ModalForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CreateUserDTO | EditUserDTO>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): CreateUserDTO | EditUserDTO {
        return this.value
      },
      set(v: CreateUserDTO | EditUserDTO) {
        this.$emit('input', v)
      },
    },
    roles(): Role[] {
      return this.$accessor.roles.getData
    },
  },
  async created() {
    this.$accessor.startLoading()
    await this.$accessor.roles.fetch()
    this.$accessor.stopLoading()
  },
  methods: {
    isNewUser(user: CreateUserDTO | EditUserDTO): user is CreateUserDTO {
      return 'id' in user === false
    },
  },
})
</script>
