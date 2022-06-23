<template>
  <validation-observer v-slot="{ handleSubmit }">
    <card class="banners-page">
      <div class="row">
        <validated-input
          v-model="form.name"
          rules="required"
          :label="$t('common.form.name')"
          :disabled="disabled"
          @input="editSlug"
        />

        <validated-input v-model="form.slug" :disabled="disabled" rules="required">
          <template #label>
            {{ $t('form.slug') }}
            <info-tooltip> {{ $t('form.slugTooltip') }}</info-tooltip>
          </template>
        </validated-input>

        <switch-input v-model="form.active" :disabled="disabled" horizontal>
          <template #title>
            {{ $t('form.active') }}
          </template>
        </switch-input>
      </div>

      <validation-provider v-slot="{ errors }" rules="responsive-media-valid|required">
        <BannerMediaForm ref="mediaForm" v-model="form.banner_media" :disabled="disabled" />
        <a-alert v-if="errors.length" type="error" show-icon :message="errors[0]" />
      </validation-provider>

      <br />
      <slot></slot>
      <br />
      <app-button v-if="!disabled" @click="handleSubmit(submit)">
        {{ $t('common.save') }}
      </app-button>
    </card>
  </validation-observer>
</template>

<i18n>
{
  "en": {
    "form": {
      "slug": "Identifier",
      "slugTooltip": "The identifier is used by applications to place banners appropriately on the page",
      "active": "Active"
    }
  },
  "pl": {
    "form": {
      "slug": "Identyfikator",
      "slugTooltip": "Identyfikator służy aplikacjom do odpowiedniego rozmieszczenia banerów na stronie",
      "active": "Aktywny"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import Card from '@/components/layout/Card.vue'
import BannerMediaForm from './BannerMediaForm.vue'

import { Banner } from '@/interfaces/Banner'
import { generateSlug } from '@/utils/generateSlug'

export default Vue.extend({
  components: { ValidationObserver, ValidationProvider, Card, BannerMediaForm },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Banner>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): Banner {
        return this.value
      },
      set(v: Banner) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    editSlug() {
      if (!this.form.id) {
        this.form.slug = generateSlug(this.form.name)
      }
    },

    submit() {
      this.$emit('submit', this.form)
    },

    clearMediaToDelete() {
      ;(this.$refs.mediaForm as any).clearMediaToDelete()
    },
  },
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  gap: 16px;
}

.banners-page {
  .row {
    @media ($max-viewport-6) {
      flex-wrap: wrap;
    }
  }
}
</style>
