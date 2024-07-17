<template>
  <Card class="organization-details">
    <Field v-if="organization">
      <template #label>
        {{ $t('details.client_id') }}
        <IconButton type="transparent" size="small" @click="editOrganization">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </IconButton>
      </template>
      {{ organization.client_id }}
    </Field>
    <Field v-if="organization">
      <template #label>
        {{ $t('details.billing_address') }}
        <IconButton type="transparent" size="small" @click="editOrganization">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </IconButton>
      </template>
      {{ organization.billing_address.address }}<br />
      {{ organization.billing_address.zip }} {{ organization.billing_address.city }}<br />
      {{ organization.billing_address.country_name }}
    </Field>
    <Field v-if="organization">
      <template #label>
        {{ $t('details.vat') }}
        <IconButton type="transparent" size="small" @click="editOrganization">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </IconButton>
      </template>
      {{ organization.billing_address.vat }}
    </Field>
    <Field v-if="organization">
      <template #label>
        {{ $t('details.billing_email') }}
        <IconButton type="transparent" size="small" @click="editOrganization">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </IconButton>
      </template>
      {{ organization.billing_email }}
    </Field>
  </Card>
</template>

<i18n lang="json">
{
  "pl": {
    "details": {
      "billing_address": "Adres firmy",
      "billing_email": "Email do faktur",
      "client_id": "ID klienta",
      "vat": "NIP"
    }
  },
  "en": {
    "details": {
      "billing_address": "organization address",
      "billing_email": "Email for invoices",
      "client_id": "Client ID",
      "vat": "VAT ID"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Organization } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import Field from '@/components/Field.vue'
import IconButton from '@/components/layout/IconButton.vue'

export default defineComponent({
  components: { Card, IconButton, Field },
  props: {
    organization: {
      type: Object as PropType<Organization>,
      required: true,
    },
  },

  methods: {
    editOrganization() {
      this.$emit('edit')
    },
  },
})
</script>

<style lang="scss" scoped>
.organization-details {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;

  @media ($viewport-7) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ($viewport-11) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
