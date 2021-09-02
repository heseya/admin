<template>
  <div class="permissions-manager">
    <span class="permissions-manager__title">Uprawnienia roli</span>
    <div v-for="{ section, permissions: groupPerms, isAssignable } in grouped" :key="section">
      <span class="permissions-manager__subtitle">
        <vs-button
          class="permissions-manager__btn"
          dark
          icon
          :transparent="!hasSome(section)"
          v-bind="disabled || !isAssignable ? { disabled: true } : {}"
          @click="() => changeAll(section)"
        >
          <i v-if="hasAll(section) && isAssignable" class="bx bx-check"></i>
          <i v-else class="bx bx-minus"></i>
        </vs-button>
        {{ section.replaceAll('_', ' ') }}
      </span>

      <div class="permissions-manager__content">
        <vs-checkbox
          v-for="perm in groupPerms"
          :key="perm.id"
          dark
          :value="has(perm.name)"
          v-bind="!perm.assignable || disabled ? { disabled: true } : {}"
          @input="() => change(perm.name)"
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
          section,
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
    text-transform: capitalize;
  }

  &__btn {
    border-radius: 50%;
    margin-left: 0;

    & ::v-deep .vs-button__content {
      padding: 4px;
    }
  }

  ::v-deep .vs-checkbox-label {
    color: #666;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 24px;
  }
}
</style>
