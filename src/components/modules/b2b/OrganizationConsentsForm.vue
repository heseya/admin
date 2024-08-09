<template>
  <div class="organization-consents">
    <Zone v-if="readonly" class="organization-consents__info" type="info">{{ $t('info') }}</Zone>

    <a-checkbox
      v-for="consent in consents"
      :key="consent.id"
      :checked="has(consent.id)"
      :disabled="readonly"
      @change="() => change(consent.id)"
    >
      {{ consent.name }} <span v-if="consent.required">*</span>
    </a-checkbox>
    <small class="organization-consents__required-info">* - {{ $t('required') }}</small>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "info": "Zgody organizacji nie mogą być edytowane przy aktualizacji organizacji",
    "required": "zgody wymagane"
  },
  "en": {
    "info": "Organization consents cannot be edited when updating the organization",
    "required": "required consents"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { OrganizationConsentDto, Consent, ConsentType } from '@heseya/store-core'

import Zone from '@/components/layout/Zone.vue'

import { sdk } from '../../../api'

export default defineComponent({
  components: { Zone },

  props: {
    value: {
      type: Object as PropType<OrganizationConsentDto>,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    consents: [] as Consent[],
  }),

  computed: {
    form: {
      get(): OrganizationConsentDto {
        return this.value
      },
      set(v: OrganizationConsentDto) {
        this.$emit('input', v)
      },
    },
  },

  async created() {
    const data = await sdk.Consents.get({ type: ConsentType.Organization })
    this.consents = data.data
  },

  methods: {
    has(consentId: string): boolean {
      return this.form[consentId]
    },
    change(consentId: string) {
      this.$set(this.form, consentId, !this.form[consentId])
    },
  },
})
</script>

<style lang="scss" scoped>
.organization-consents {
  display: flex;
  flex-direction: column;

  &__info {
    margin-bottom: 16px;
  }

  &__required-info {
    margin-top: 8px;
    font-size: 0.8em;
  }
}
</style>
