<template>
  <modal-form>
    <validated-input rules="required" v-model="form.name" label="Nazwa" />
    <validated-input rules="required|email" v-model="form.email" label="Email" />
    <validated-input
      v-if="isNewUser(form)"
      type="password"
      rules="required|password"
      v-model="form.password"
      label="Hasło"
    />

    <vs-select
      v-model="form.roles"
      label="Kolekcje"
      :key="roles.length"
      filter
      multiple
      @click.native.prevent.stop
    >
      <vs-option
        v-for="role in roles"
        :key="role.id"
        :label="role.name"
        :value="role.id"
        :disabled="!role.assignable"
      >
        {{ role.name }}
      </vs-option>
    </vs-select>
  </modal-form>
</template>

<script lang="ts">
import Vue from 'vue'

import ModalForm from '@/components/form/ModalForm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { CreateUserDTO, EditUserDTO } from '@/interfaces/User'
import { Role } from '@/interfaces/Role'

export default Vue.extend({
  components: {
    ModalForm,
    ValidatedInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CreateUserDTO | EditUserDTO>,
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
  methods: {
    isNewUser(user: CreateUserDTO | EditUserDTO): user is CreateUserDTO {
      return 'id' in user === false
    },
  },
  async created() {
    this.$accessor.startLoading()
    await this.$accessor.roles.fetch()
    this.$accessor.stopLoading()
  },
})
</script>
