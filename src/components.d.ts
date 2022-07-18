declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    AppInput: typeof import('@/components/form/AppInput.vue')['default']
    AppSelect: typeof import('@/components/form/AppSelect.vue')['default']
    SwitchInput: typeof import('@/components/form/SwitchInput.vue')['default']
    ValidatedSwitchInput: typeof import('@/components/form/ValidatedSwitchInput.vue')['default']
    ValidatedInput: typeof import('@/components/form/ValidatedInput.vue')['default']
    ValidatedSelect: typeof import('@/components/form/ValidatedSelect.vue')['default']
    IconButton: typeof import('@/components/layout/IconButton.vue')['default']
    AppButton: typeof import('@/components/layout/AppButton.vue')['default']
    InfoTooltip: typeof import('@/components/layout/InfoTooltip.vue')['default']
    BooleanTag: typeof import('@/components/layout/BooleanTag.vue')['default']
    Tag: typeof import('@/components/Tag.vue')['default']
  }
}

export {}
