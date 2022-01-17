<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form class="tfa-code-form" @submit.prevent.stop="handleSubmit(onSubmit)">
      <icon-button reversed size="small" class="tfa-code-form__cancel-btn" @click="$emit('cancel')">
        <template #icon>
          <i class="bx bx-left-arrow-alt"></i>
        </template>
        Wróć do formularza logowania
      </icon-button>

      <p v-if="method === TwoFactorAuthMethod.App">
        Wpisz poniżej kod autoryzacyjny, który wyświetla się na twoim urządzeniu w aplikacji do
        weryfikacji dwuetapowej.
      </p>
      <p v-else-if="method === TwoFactorAuthMethod.Email">
        Wysłaliśmy do Ciebie wiadomość e-mail z kodem autoryzującym. Wpisz go poniżej aby się
        zalogować. Kod jest ważny przez 15 minut.
      </p>

      <validated-input
        v-model="code"
        rules="required"
        name="code"
        data-cy="code"
        label="Kod autoryzacyjny"
        class="tfa-code-form__input"
      />

      <app-button data-cy="submitBtn" html-type="submit" type="primary"> Zaloguj </app-button>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    } as Vue.PropOptions<TwoFactorAuthMethod>,
  },
  computed: {
    code: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
    TwoFactorAuthMethod(): typeof TwoFactorAuthMethod {
      return TwoFactorAuthMethod
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.code)
    },
  },
})
</script>

<style lang="scss" scoped>
.tfa-code-form {
  &__cancel-btn {
    margin-bottom: 24px;
  }

  &__input {
    margin: 16px 0;
  }
}
</style>
