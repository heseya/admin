<template>
  <div class="b2b-company-view">
    <top-nav>
      <template v-if="company" #title>
        {{ company.billing_address.name }}
        <icon-button type="transparent" @click="isEditModalActive = true">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </icon-button>
      </template>

      <pop-confirm
        v-can="$p.Organizations.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteCompany"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="b2b-company-grid">
      <OrganizationDetails
        v-if="company"
        class="b2b-company-grid__description"
        :organization="company"
      />

      <CompanyUsersList v-if="company" class="b2b-company-grid__users" :company="company" />

      <OrganizationSalesChannel
        v-if="company"
        class="b2b-company-grid__sales-channel"
        :organization="company"
      />

      <CompanyPromoList v-if="company" class="b2b-company-grid__promotions" :company="company" />
    </div>

    <CompanyForm :initial-value="company" :visible="isEditModalActive" @saved="updateCompany" />
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

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

import CompanyPromoList from '@/components/modules/b2b/CompanyPromoList.vue'
import OrganizationDetails from '@/components/modules/b2b/OrganizationDetails.vue'
import OrganizationSalesChannel from '@/components/modules/b2b/OrganizationSalesChannel.vue'
import CompanyUsersList from '@/components/modules/b2b/CompanyUsersList.vue'
import CompanyForm from '@/components/modules/b2b/CompanyForm.vue'

import { Organization } from '@heseya/store-core'

export default defineComponent({
  components: {
    TopNav,
    PopConfirm,
    OrganizationDetails,
    OrganizationSalesChannel,
    CompanyUsersList,
    CompanyPromoList,
    CompanyForm,
  },

  data: () => ({
    isEditModalActive: false,
    company: null as Organization | null,
  }),

  async created() {
    await this.$accessor.b2bOrganizations.get(this.$route.params.id)
    this.company = this.$accessor.b2bOrganizations.getSelected || ({} as Organization)
  },

  methods: {
    async deleteCompany() {
      // eslint-disable-next-line no-console
      if (!this.company) return console.error('Company does not exist')

      this.$accessor.startLoading()
      const success = await this.$accessor.b2bOrganizations.remove(this.company.id)
      this.$accessor.stopLoading()

      if (success) {
        this.$toast.success(this.$t('deleteSuccess') as string)
        this.$router.push('/b2b/organizations')
      }
    },
    updateCompany(company: Organization) {
      this.company = company
      this.isEditModalActive = false
    },
  },
})
</script>

<style lang="scss" scoped>
.b2b-company-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'description' 'users' 'sales-channel' 'promotions';
  grid-template-rows: auto 1fr;
  grid-gap: 9px 14px;

  @media ($viewport-11) {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 'description users' 'promotions sales-channel';
  }

  .card {
    margin-bottom: 0;
  }

  &__description {
    grid-area: description;
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
  &__users {
    grid-area: users;
  }
  &__sales-channel {
    grid-area: sales-channel;
  }
  &__promotions {
    grid-area: promotions;
  }
}
</style>
