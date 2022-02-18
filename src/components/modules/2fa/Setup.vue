<template>
  <div class="setup-2fa">
    <transition name="fade" mode="out-in">
      <setup-intro
        v-if="step === ProgressStep.Init"
        @start-app="startAppSetup"
        @start-email="startEmailSetup"
      />

      <div v-else-if="step === ProgressStep.Started" class="setup-2fa__setup">
        <icon-button reversed size="small" @click="step = ProgressStep.Init">
          <template #icon>
            <i class="bx bx-left-arrow-alt"></i>
          </template>
          {{ $t('changeMethod') }}
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

        <setup-confirm @confirmed="confirmTwoFactorAuth" />
      </div>

      <setup-finished v-else-if="step === ProgressStep.Finished" :recovery-codes="recoveryCodes" />
    </transition>
  </div>
</template>

<i18n>
{
  "pl": {
    "changeMethod": "Zmień metodę"
  },
  "en": {
    "changeMethod": "Change method"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import IconButton from '@/components/layout/IconButton.vue'

import SetupIntro from './SetupIntro.vue'
import SetupEmail from './SetupEmail.vue'
import SetupApp from './SetupApp.vue'
import SetupConfirm from './SetupConfirm.vue'
import SetupFinished from './SetupFinished.vue'

import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'

enum ProgressStep {
  Init,
  Started,
  Finished,
}

export default Vue.extend({
  components: {
    SetupApp,
    SetupEmail,
    IconButton,
    SetupFinished,
    SetupIntro,
    SetupConfirm,
  },
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
    startAppSetup() {
      this.selectedMethod = TwoFactorAuthMethod.App
      this.step = ProgressStep.Started
    },
    startEmailSetup() {
      this.selectedMethod = TwoFactorAuthMethod.Email
      this.step = ProgressStep.Started
    },

    cancelSetup() {
      this.selectedMethod = null
      this.step = ProgressStep.Init
    },

    confirmTwoFactorAuth(recoveryCodes: string[]) {
      this.step = ProgressStep.Finished
      this.recoveryCodes = recoveryCodes
    },
  },
})
</script>
