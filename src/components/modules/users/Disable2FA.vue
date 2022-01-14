<template>
  <div class="disable-2fa">
    <h3 class="disable-2fa__title">
      Weryfikacja dwuetapowa
      <!-- <a-tooltip>
        <template #title> TODO </template>
        <i class="bx bxs-info-circle"></i>
      </a-tooltip> -->
    </h3>
    <span v-if="is2faEnabled" class="disable-2fa__text disable-2fa__text--enabled">
      Użytkownik ma aktywną weryfikację dwuetapową
    </span>
    <span v-else class="disable-2fa__text disable-2fa__text--disabled">
      Użytkownik nie posiada aktywnej weryfikacji dwuetapowej
    </span>

    <pop-confirm
      v-if="!isLoggedUser && is2faEnabled"
      v-can="$p.Users.TfaRemove"
      title="Czy na pewno chcesz wyłączyć weryfikację dwuetapową dla tego użytkownika?"
      @confirm="disable2FA"
    >
      <app-button :disabled="disabled" size="small" type="danger" class="disable-2fa__disable-btn">
        Wyłącz weryfikację dwuetapową
      </app-button>
    </pop-confirm>
  </div>
</template>

<script lang="ts">
import PopConfirm from '@/components/layout/PopConfirm.vue'
import { formatApiNotificationError } from '@/utils/errors'
import Vue from 'vue'
export default Vue.extend({
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

      const result: { success: true } | { success: false; error: any } =
        // @ts-ignore // TODO: fix extended store actions typings
        await this.$accessor.users.removeUser2FA(this.userId)

      if (result.success) this.$toast.success('Weryfikacja dwuetapowa została usunięta')
      else this.$toast.error(formatApiNotificationError(result.error))

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
      color: $blue-color-500;
      margin-left: 8px;
    }
  }

  &__text {
    font-weight: 600;

    &--enabled {
      color: $green-color-500;
    }

    &--disabled {
      color: $red-color-500;
    }
  }

  &__disable-btn {
    align-self: flex-start;
    margin-top: 4px;
  }
}
</style>
