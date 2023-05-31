<template>
  <validation-observer v-slot="{ handleSubmit }" class="order-product-url-form">
    <form @submit.prevent="handleSubmit(submit)">
      <h3>{{ isNew ? $t('create.title') : $t('update.title') }}</h3>

      <validated-input
        v-model="form.name"
        name="name"
        rules="required"
        :disabled="!isNew"
        :label="$t('common.form.name')"
      />
      <validated-input
        v-model="form.url"
        name="url"
        rules="required|url"
        :label="$t('common.form.slug')"
      />

      <br />
      <app-button type="primary" :loading="isLoading" :disabled="isLoading" html-type="submit">
        {{ $t('common.save') }}
      </app-button>
    </form>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "create": {
      "title": "Dodaj nowy URL",
      "successMessage": "Nowy URL został dodany",
      "errorMessage": "Wystąpił błąd podczas dodawania nowego URL"
    },
    "update": {
      "title": "Edytuj URL",
      "successMessage": "URL został zaktualizowany",
      "errorMessage": "Wystąpił błąd podczas aktualizacji URL"
    }
  },
  "en": {
    "create": {
      "title": "Add new URL",
      "successMessage": "New URL has been added",
      "errorMessage": "An error occurred while adding new URL"
    },
    "update": {
      "title": "Edit URL",
      "successMessage": "URL has been updated",
      "errorMessage": "An error occurred while updating URL"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { OrderProductUrl } from '@heseya/store-core'

export default defineComponent({
  components: { ValidationObserver },

  props: {
    editedUrl: {
      type: Object,
      default: null,
    } as PropOptions<OrderProductUrl | null>,
    orderId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    form: {
      name: '',
      url: '',
    },
  }),

  computed: {
    isNew(): boolean {
      return !this.editedUrl
    },
  },

  beforeMount() {
    if (this.editedUrl) {
      this.form.name = this.editedUrl.name
      this.form.url = this.editedUrl.url
    }
  },

  methods: {
    async submit() {
      this.isLoading = true
      const success = await this.$accessor.orders.updateOrderProductUrls({
        orderId: this.orderId,
        productId: this.productId,
        urls: {
          [this.form.name]: this.form.url,
        },
      })

      if (success) {
        this.$toast.success(
          this.$t(this.isNew ? 'create.successMessage' : 'update.successMessage') as string,
        )
        this.$emit('close')
      } else
        this.$toast.error(
          this.$t(this.isNew ? 'create.errorMessage' : 'update.errorMessage') as string,
        )

      this.isLoading = false
    },
  },
})
</script>
