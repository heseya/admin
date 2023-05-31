<template>
  <modal-form>
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      rules="required"
      name="name"
      :label="$t('name')"
    />

    <validated-input
      v-model="form.email"
      :disabled="disabled"
      rules="required|email"
      name="email"
      :label="$t('email')"
    />

    <validated-input v-model="form.phone" name="phone" :label="$t('phone')" type="tel" rules="" />

    <validated-input
      v-model="form.birthday_date"
      name="birthday_date"
      :label="$t('birthday')"
      type="date"
      rules=""
    />

    <validated-input
      v-if="isNewUser(form)"
      v-model="form.password"
      :disabled="disabled"
      type="password"
      name="password"
      rules="required|password"
      :label="$t('password')"
    />

    <app-select
      v-model="form.roles"
      :disabled="disabled"
      :label="$t('roles')"
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

    <template v-if="!isNewUser(form)">
      <hr />
      <Disable2FA
        :user-id="form.id"
        :is2fa-enabled="form.is_tfa_active"
        @close-modal="$emit('close')"
      />
    </template>
  </modal-form>
</template>

<i18n lang="json">
{
  "pl": {
    "name": "Nazwa",
    "email": "Email",
    "phone": "Numer telefonu",
    "birthday": "Data urodzenia",
    "password": "Hasło",
    "roles": "Role"
  },
  "en": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone number",
    "birthday": "Birthday",
    "password": "Password",
    "roles": "Roles"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { Role, UserCreateDto, UserUpdateDto } from '@heseya/store-core'

import ModalForm from '@/components/form/ModalForm.vue'
import Disable2FA from './Disable2FA.vue'

// eslint-disable-next-line camelcase
type UserDTO = UserCreateDto | (UserUpdateDto & { is_tfa_active: boolean })

export default defineComponent({
  components: {
    ModalForm,
    Disable2FA,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as PropOptions<UserDTO>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): UserDTO {
        return this.value
      },
      set(v: UserDTO) {
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
    isNewUser(user: UserDTO): user is UserCreateDto {
      return 'id' in user === false
    },
  },
})
</script>
