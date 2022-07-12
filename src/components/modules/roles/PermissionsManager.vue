<template>
  <div class="permissions-manager">
    <span class="permissions-manager__title">{{ $t('title') }}</span>
    <div v-for="{ section, permissions: groupPerms, isAssignable } in grouped" :key="section">
      <span class="permissions-manager__subtitle">
        <a-checkbox
          :checked="hasAll(section) && isAssignable"
          :disabled="disabled || !isAssignable"
          :indeterminate="hasSome(section) && !(hasAll(section) && isAssignable)"
          @change="() => changeAll(section)"
        >
          {{ $t(`sections.${section}`) || section.replace(/_/g, ' ') }}
        </a-checkbox>
      </span>

      <div class="permissions-manager__content">
        <a-checkbox
          v-for="perm in groupPerms"
          :key="perm.id"
          :checked="has(perm.name)"
          :disabled="!perm.assignable || disabled"
          @change="() => change(perm.name)"
        >
          {{ perm.display_name || perm.name }}

          <info-tooltip v-if="perm.description"> {{ perm.description }} </info-tooltip>
        </a-checkbox>
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Uprawnienia roli",
    "sections": {
      "admin": "Administracja",
      "analytics": "Statystyka",
      "apps": "Zarządzanie aplikacjami",
      "app": "Aplikacje zewnętrzne",
      "audits": "Historia zmian",
      "auth": "Autoryzacja użytkowników",
      "product_sets": "Kolekcje",
      "consents": "Zgody",
      "countries": "Kraje",
      "shipping_methods": "Metody dostawy",
      "deposits": "Depozyty",
      "coupons": "Kody rabatowe",
      "items": "Przedmioty magazynowe",
      "schemas": "Schematy",
      "cart": "Koszyk",
      "orders": "Zamówienia ",
      "packages": "Szablony przesyłek",
      "pages": "Strony",
      "payments": "Płatności",
      "payment_methods": "Metody Płatności",
      "products": "Produkty",
      "settings": "Ustawienia zaawansowane",
      "statuses": "Statusy zamówień",
      "tags": "Tagi",
      "users": "Użytkownicy",
      "roles": "Role użytkowników",
      "webhooks": "Webhooki",
      "events": "Wydarzenia aktywujące Webhooki",
      "seo": "SEO",
      "attributes": "Cechy"
    }
  },
  "en": {
    "title": "Permissions manager",
    "sections": {
      "admin": "Administration",
      "analytics": "Analytics",
      "apps": "Apps management",
      "app": "External apps",
      "audits": "Audits",
      "auth": "Auth",
      "product_sets": "Product sets",
      "consents": "Consents",
      "countries": "Countries",
      "shipping_methods": "Shipping methods",
      "deposits": "Deposits",
      "coupons": "Coupons",
      "items": "Items",
      "schemas": "Schemas",
      "cart": "Cart",
      "orders": "Orders",
      "packages": "Packages",
      "pages": "Pages",
      "payments": "Payments",
      "payment_methods": "Payment methods",
      "products": "Products",
      "settings": "Advanced settings",
      "statuses": "Statuses",
      "tags": "Tags",
      "users": "Users",
      "roles": "Roles",
      "webhooks": "Webhooks",
      "events": "Webhooks events",
      "seo": "SEO",
      "attributes": "Attributes"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { groupBy } from 'lodash'
import { Permission, PermissionObject } from '@/interfaces/Permissions'

interface GroupedPermissions {
  section: string
  permissions: PermissionObject[]
  assignablePermissions: PermissionObject[]
  isAssignable: boolean
}

export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<Permission[]>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): Permission[] {
        return this.value
      },
      set(v: Permission[]) {
        this.$emit('input', v)
      },
    },
    permissions(): PermissionObject[] {
      return this.$accessor.roles.permissions
    },
    grouped(): GroupedPermissions[] {
      const grouped = groupBy(this.permissions, (p) => p.name.split('.')[0])
      return Object.keys(grouped)
        .map((section) => ({
          section: section,
          permissions: grouped[section],
          assignablePermissions: grouped[section].filter((p) => p.assignable),
          isAssignable: grouped[section].some((p) => p.assignable),
        }))
        .sort((a, b) => (a.section > b.section ? 1 : -1))
    },
  },
  created() {
    // @ts-ignore // TODO: fix extended store actions typings
    this.$accessor.roles.fetchPermissions()
  },
  methods: {
    submit() {
      this.$emit('submit', this.form)
    },
    has(perm: Permission): boolean {
      return this.form.includes(perm)
    },
    change(perm: Permission) {
      if (this.has(perm)) {
        this.form = this.form.filter((p) => p !== perm)
      } else {
        this.form.push(perm)
      }
    },

    getGroup(section: string): GroupedPermissions {
      return this.grouped.find((g) => g.section === section)!
    },

    hasAll(section: string): boolean {
      const group = this.getGroup(section)
      return group.assignablePermissions.every((p) => this.has(p.name))
    },
    hasSome(section: string): boolean {
      const group = this.getGroup(section)
      return group.assignablePermissions.some((p) => this.has(p.name))
    },
    changeAll(section: string) {
      const group = this.getGroup(section)
      let form = [...this.form]

      // take back all group permissions
      form = this.form.filter((p) => !group.assignablePermissions.find((g) => g.name === p))
      if (!this.hasAll(section)) {
        // add all group permissions
        form = this.form.concat(
          group.assignablePermissions.filter((p) => p.assignable).map((p) => p.name),
        )
      }

      this.form = [...form]
    },
  },
})
</script>

<style lang="scss" scoped>
.permissions-manager {
  &__title {
    font-size: 1.2em;
    margin-bottom: 8px;
    display: block;
    font-weight: 600;
  }

  &__subtitle {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    font-weight: 600;

    > * {
      color: $font-color;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 24px;

    @media ($viewport-6) {
      grid-template-columns: 1fr 1fr;
    }

    i {
      color: $primary-color-500;
    }
  }
}
</style>
