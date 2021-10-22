<template>
  <div class="permissions-manager">
    <span class="permissions-manager__title">Uprawnienia roli</span>
    <div v-for="{ section, permissions: groupPerms, isAssignable } in grouped" :key="section">
      <span class="permissions-manager__subtitle">
        <a-checkbox
          :checked="hasAll(section) && isAssignable"
          :disabled="disabled || !isAssignable"
          :indeterminate="hasSome(section) && !(hasAll(section) && isAssignable)"
          @change="() => changeAll(section)"
        >
          {{ PERMISSIONS_GROUP_LABELS[section] || section.replace(/_/g, ' ') }}
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

          <a-tooltip v-if="perm.description">
            <template slot="title"> {{ perm.description }} </template>
            <i class="bx bxs-info-circle"></i>
          </a-tooltip>
        </a-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { groupBy } from 'lodash'

import { Permission, PermissionObject } from '@/interfaces/Permissions'
import { PERMISSIONS_GROUP_LABELS } from '@/consts/permissions'

type SectionKey = keyof typeof PERMISSIONS_GROUP_LABELS

interface GroupedPermissions {
  section: SectionKey
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
          section: section as SectionKey,
          permissions: grouped[section],
          assignablePermissions: grouped[section].filter((p) => p.assignable),
          isAssignable: grouped[section].some((p) => p.assignable),
        }))
        .sort((a, b) => (a.section > b.section ? 1 : -1))
    },
    PERMISSIONS_GROUP_LABELS(): typeof PERMISSIONS_GROUP_LABELS {
      return PERMISSIONS_GROUP_LABELS
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
