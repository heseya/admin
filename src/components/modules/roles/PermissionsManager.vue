<template>
  <div class="permissions-manager">
    <span class="permissions-manager__title">Uprawnienia roli</span>
    <div v-for="{ section, permissions } in grouped" :key="section">
      <span class="permissions-manager__subtitle">{{ section.replaceAll('_', ' ') }}</span>
      <div class="permissions-manager__content">
        <vs-checkbox
          v-for="perm in permissions"
          dark
          :key="perm.id"
          :value="has(perm.name)"
          @input="change(perm.name)"
          v-bind="!perm.assignable || disabled ? { disabled: true } : {}"
        >
          {{ perm.name }}
        </vs-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Permission, PermissionObject } from '@/interfaces/Permissions'
import { groupBy } from 'lodash'

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
    grouped(): { section: string; permissions: PermissionObject[] }[] {
      const grouped = groupBy(this.permissions, (p) => p.name.split('.')[0])
      return Object.keys(grouped)
        .map((section) => ({ section, permissions: grouped[section] }))
        .sort((a, b) => (a.section > b.section ? 1 : -1))
    },
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
  },
  created() {
    // @ts-ignore // TODO: fix extended store actions typings
    this.$accessor.roles.fetchPermissions()
  },
})
</script>

<style lang="scss" scoped>
.permissions-manager {
  &__title {
    font-size: 1.2em;
    margin-bottom: 8px;
    display: block;
    font-family: $font-sec;
  }

  &__subtitle {
    margin-bottom: 4px;
    display: block;
    font-family: $font-sec;
    text-transform: capitalize;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 24px;
  }
}
</style>
