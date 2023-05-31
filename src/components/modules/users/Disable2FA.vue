<template>
  <div class="disable-2fa">
    <h3 class="disable-2fa__title">
      {{ $t('title') }}
      <!-- <a-tooltip>
        <template #title> 2FA Tooltip text </template>
        <i class="bx bxs-info-circle"></i>
      </a-tooltip> -->
    </h3>
    <span v-if="is2faEnabled" class="disable-2fa__text disable-2fa__text--enabled">
      {{ $t('active') }}
    </span>
    <span v-else class="disable-2fa__text disable-2fa__text--disabled">
      {{ $t('inactive') }}
    </span>

    <pop-confirm
      v-if="!isLoggedUser && is2faEnabled"
      v-can="$p.Users.TfaRemove"
      :title="$t('disableText')"
      @confirm="disable2FA"
    >
      <app-button :disabled="disabled" size="small" type="danger" class="disable-2fa__disable-btn">
        {{ $t('disableConfirm') }}
      </app-button>
    </pop-confirm>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Weryfikacja dwuetapowa",
    "active": "Użytkownik ma aktywną weryfikację dwuetapową",
    "inactive": "Użytkownik nie posiada aktywnej weryfikacji dwuetapowej",
    "disableText": "Czy na pewno chcesz wyłączyć weryfikację dwuetapową dla tego użytkownika?",
    "disableConfirm": "Wyłącz weryfikację dwuetapową"
  },
  "en": {
    "title": "Two-factor authentication",
    "active": "User has active two-factor authentication",
    "inactive": "User has no active two-factor authentication",
    "disableText": "Are you sure you want to disable two-factor authentication for this user?",
    "disableConfirm": "Disable two-factor authentication"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import { ApiError, formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  components: { PopConfirm },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    is2faEnabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isLoggedUser(): boolean {
      return this.userId === this.$accessor.auth.user?.id
    },
  },
  methods: {
    async disable2FA() {
      this.$accessor.startLoading()

      const result = await this.$accessor.users.removeUser2FA(this.userId)

      if (result.success) this.$toast.success('Weryfikacja dwuetapowa została usunięta')
      else this.$toast.error(formatApiNotificationError(result.error as ApiError))

      this.$accessor.stopLoading()
      this.$emit('close-modal')
    },
  },
})
</script>

<style lang="scss" scoped>
.disable-2fa {
  display: flex;
  flex-direction: column;

  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 0;

    i {
      color: var(--blue-color-500);
      margin-left: 8px;
    }
  }

  &__text {
    font-weight: 600;

    &--enabled {
      color: var(--green-color-500);
    }

    &--disabled {
      color: var(--red-color-500);
    }
  }

  &__disable-btn {
    align-self: flex-start;
    margin-top: 4px;
  }
}
</style>
