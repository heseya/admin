<template>
  <div class="b2b-organization-view">
    <top-nav>
      <template v-if="organization" #title>
        {{ organization.billing_address.company_name || organization.billing_address.name }}
        <icon-button type="transparent" @click="isEditModalActive = true">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </icon-button>
      </template>

      <pop-confirm
        v-can="$p.Organizations.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteOrganization"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="b2b-organization-grid">
      <OrganizationDetails
        v-if="organization"
        class="b2b-organization-grid__details"
        :organization="organization"
        @edit="isEditModalActive = true"
      />

      <OrganizationUsersList
        v-if="organization"
        class="b2b-organization-grid__users"
        :organization="organization"
      />

      <OrganizationSalesChannel
        v-if="organization"
        class="b2b-organization-grid__sales-channel"
        :organization="organization"
        @edit="isEditModalActive = true"
      />

      <OrganizationShippingAddresses
        v-if="organization"
        class="b2b-organization-grid__shipping-addresses"
        :organization="organization"
      />

      <OrganizationsPromotionsList
        v-if="organization"
        class="b2b-organization-grid__promotions"
        :organization="organization"
      />
    </div>

    <OrganizationEditForm
      :initial-value="organization"
      :visible="isEditModalActive"
      @saved="updateOrganization"
      @close="isEditModalActive = false"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "deleteText": "Czy na pewno chcesz usunąć firmę?",
    "deleteSuccess": "Firma została usunięta"
  },
  "en": {
    "deleteText": "Are you sure you want to delete the company?",
    "deleteSuccess": "Company has been deleted"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Organization } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

import OrganizationsPromotionsList from '@/components/modules/b2b/OrganizationsPromotionsList.vue'
import OrganizationDetails from '@/components/modules/b2b/OrganizationDetails.vue'
import OrganizationSalesChannel from '@/components/modules/b2b/OrganizationSalesChannel.vue'
import OrganizationUsersList from '@/components/modules/b2b/OrganizationUsersList.vue'
import OrganizationShippingAddresses from '@/components/modules/b2b/OrganizationShippingAddresses.vue'
import OrganizationEditForm from '@/components/modules/b2b/OrganizationEditForm.vue'

export default defineComponent({
  components: {
    TopNav,
    PopConfirm,
    OrganizationDetails,
    OrganizationSalesChannel,
    OrganizationUsersList,
    OrganizationsPromotionsList,
    OrganizationShippingAddresses,
    OrganizationEditForm,
  },

  data: () => ({
    isEditModalActive: false,
    organization: null as Organization | null,
  }),

  async created() {
    await this.$accessor.b2bOrganizations.get(this.$route.params.id)
    this.organization = this.$accessor.b2bOrganizations.getSelected || ({} as Organization)
  },

  methods: {
    async deleteOrganization() {
      // eslint-disable-next-line no-console
      if (!this.organization) return console.error('organization does not exist')

      this.$accessor.startLoading()
      const success = await this.$accessor.b2bOrganizations.remove(this.organization.id)
      this.$accessor.stopLoading()

      if (success) {
        this.$toast.success(this.$t('deleteSuccess') as string)
        this.$router.push('/b2b/organizations')
      }
    },
    updateOrganization(organization: Organization) {
      this.organization = organization
      this.isEditModalActive = false
    },
  },
})
</script>

<style lang="scss" scoped>
.b2b-organization-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'details' 'shipping-addresses' 'users' 'sales-channel' 'promotions';
  grid-template-rows: auto 1fr;
  grid-gap: 9px 14px;

  @media ($viewport-11) {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 'details users' 'shipping-addresses sales-channel' 'promotions sales-channel';
  }

  .card {
    margin-bottom: 0;
  }

  &__details {
    grid-area: details;
  }
  &__users {
    grid-area: users;
  }
  &__sales-channel {
    grid-area: sales-channel;
  }
  &__promotions {
    grid-area: promotions;
  }
  &___shipping-addresses {
    grid-area: shipping-addresses;
  }
}
</style>
