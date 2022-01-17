<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form class="login-form" @submit.prevent.stop="handleSubmit(onSubmit)">
      <validated-input
        v-model="form.email"
        rules="required|email"
        name="email"
        data-cy="email"
        label="E-mail"
        type="email"
      />

      <validated-input
        v-model="form.password"
        rules="required"
        label="Hasło"
        name="password"
        data-cy="password"
        type="password"
      />

      <div class="central-screen-form__row login-form__btns">
        <app-button data-cy="submitBtn" html-type="submit" type="primary"> Zaloguj </app-button>
        <app-button type="white" to="/reset-password"> Zapomniałeś hasła? </app-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

interface ILoginForm {
  email: string
  password: string
}

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ILoginForm>,
  },
  computed: {
    form: {
      get(): ILoginForm {
        return this.value
      },
      set(value: ILoginForm) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style lang="scss" scoped>
.login-form {
  &__btns {
    margin-top: 24px;
  }
}
</style>
