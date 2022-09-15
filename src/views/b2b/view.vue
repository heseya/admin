<template>
  <div class="b2b-company-view">
    <top-nav>
      <template #title>
        {{ company.name }}
        <icon-button type="transparent">
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </icon-button>
      </template>

      <pop-confirm
        v-can="$p.Roles.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
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
      <card class="b2b-company-grid__description">
        <field>
          <template #label>
            {{ $t('common.form.description') }}
            <icon-button type="transparent" size="small">
              <template #icon> <i class="bx bx-edit-alt"></i> </template>
            </icon-button>
          </template>
          {{ company.description }}
        </field>
      </card>

      <company-users-list v-if="company.id" class="b2b-company-grid__users" :company="company" />

      <company-promo-list
        v-if="company.id"
        class="b2b-company-grid__promotions"
        :company="company"
      />
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "deleteText": "Czy na pewno chcesz usunąć firmę?"
  },
  "en": {
    "deleteText": "Are you sure you want to delete the company?"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import Field from '@/components/Field.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import TopNav from '@/components/layout/TopNav.vue'
import CompanyPromoList from '@/components/modules/b2b/CompanyPromoList.vue'
import CompanyUsersList from '@/components/modules/b2b/CompanyUsersList.vue'

import { Role } from '@heseya/store-core'

export default Vue.extend({
  components: { TopNav, PopConfirm, Card, Field, CompanyUsersList, CompanyPromoList },
  computed: {
    company(): Role {
      return this.$accessor.b2bCompanies.getSelected || ({} as Role)
    },
  },

  created() {
    this.$accessor.b2bCompanies.get(this.$route.params.id)
  },

  methods: {
    deleteCompany() {},
  },
})
</script>

<style lang="scss" scoped>
.b2b-company-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'description' 'promotions' 'users';
  grid-gap: 9px 14px;

  @media ($viewport-11) {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 'description users' 'promotions users';
  }

  .card {
    margin-bottom: 0;
  }

  &__description {
    grid-area: description;
  }
  &__users {
    grid-area: users;
  }
  &__promotions {
    grid-area: promotions;
  }
}
</style>
