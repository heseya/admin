<template>
  <div class="setup-2fa">
    <transition name="fade" mode="out-in">
      <div v-if="step === ProgressStep.Init" class="setup-2fa__intro">
        <h3>Aktywuj weryfikację dwuetapową by zwiększyć bezpieczeństwo konta</h3>
        <p>
          Weryfikacja dwuetapowa to podwójne sprawdzenie tożsamości (uwierzytelnianie) podczas
          logowania. Nie wystarczy podać samego hasła ale również ustalony drugi składnik - kod SMS
          lub aplikacji Authenticator.
        </p>
        <p>
          Pozwoli to na zabezpieczenie Twojego konta, w przypadku gdyby komuś udało się przejąć
          twoje hasło.
        </p>

        <h3 class="setup-2fa__subtitle">Wybierz metodę weryfikacji dwuetapowej</h3>
        <div class="setup-2fa__buttons">
          <app-button type="primary" @click="startAppSetup">Aplikacja</app-button>
          <app-button type="primary" @click="startEmailSetup">Email</app-button>
        </div>
      </div>

      <div v-else-if="step === ProgressStep.Started" class="setup-2fa__setup">
        <icon-button reversed size="small" @click="step = ProgressStep.Init">
          <template #icon>
            <i class="bx bx-left-arrow-alt"></i>
          </template>
          Zmień metodę
        </icon-button>

        <setup-app
          v-if="selectedMethod === TwoFactorAuthMethod.App"
          @cancel="cancelSetup"
          @confirm="confirmTwoFactorAuth"
        />
        <setup-email
          v-else-if="selectedMethod === TwoFactorAuthMethod.Email"
          @cancel="cancelSetup"
          @confirm="confirmTwoFactorAuth"
        />

        <hr />

        <div class="setup-2fa__confirm-section">
          <app-input v-model="confirmCode" name="confirm_code" label="Kod autoryzacyjny" />
          <app-button type="primary" @click="confirmTwoFactorAuth">
            Aktywuj weryfikację dwuetapową
          </app-button>
        </div>
      </div>

      <div v-else-if="step === ProgressStep.Finished" class="setup-2fa__success">
        <h3><i class="bx bxs-check-circle"></i> Weryfikacja dwuetapowa została aktywowana!</h3>
        <p>
          Poniżej widzisz kody odzyskujące. Zapisz je w bezpiecznym miejscu. Mogą okazać się
          potrzebne gdy stracisz urządzenie na którym aktywowałeś podwójną weryfikacje. Kodów możesz
          użyć do zalogowania, pamiętaj jednak, że są jednorazowe! Nowe kody możesz wygenerować w
          ustawieniach.
        </p>
        <div class="setup-2fa__codes">
          <code v-for="code in recoveryCodes" :key="code"> {{ code }} </code>
        </div>

        <app-button type="primary" to="/settings"> Wróć do ustawień </app-button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AppButton from '@/components/layout/AppButton.vue'
import SetupEmail from './SetupEmail.vue'
import SetupApp from './SetupApp.vue'

import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'
import { confirmTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'
import IconButton from '@/components/layout/IconButton.vue'

enum ProgressStep {
  Init,
  Started,
  Finished,
}

export default Vue.extend({
  components: { AppButton, SetupApp, SetupEmail, IconButton },
  data: () => ({
    step: ProgressStep.Init,
    selectedMethod: null as TwoFactorAuthMethod | null,
    confirmCode: '',
    recoveryCodes: [] as string[],
  }),
  computed: {
    ProgressStep(): typeof ProgressStep {
      return ProgressStep
    },
    TwoFactorAuthMethod(): typeof TwoFactorAuthMethod {
      return TwoFactorAuthMethod
    },
  },
  methods: {
    cancelSetup() {
      this.selectedMethod = null
      this.step = ProgressStep.Init
    },
    startAppSetup() {
      this.selectedMethod = TwoFactorAuthMethod.App
      this.step = ProgressStep.Started
    },
    startEmailSetup() {
      this.selectedMethod = TwoFactorAuthMethod.Email
      this.step = ProgressStep.Started
    },
    async confirmTwoFactorAuth() {
      const result = await confirmTwoFactorAuth(this.confirmCode)
      if (result.success) {
        this.step = ProgressStep.Finished
        this.recoveryCodes = result.recoveryCodes
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.setup-2fa {
  .bxs-check-circle {
    color: $green-color-500;
  }

  &__subtitle {
    text-align: center;
    margin-top: 24px;
  }

  &__buttons {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 24px;
  }

  &__confirm-section {
    text-align: left;
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }

  &__success {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__codes {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    code {
      margin: 8px;
      font-size: 2em;
    }
  }
}
</style>
