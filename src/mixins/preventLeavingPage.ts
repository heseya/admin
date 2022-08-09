import i18n from '@/i18n'

export default {
  beforeRouteLeave(to: any, from: any, next: any) {
    // @ts-ignore
    if (this.confirmStayInDirtyForm()) {
      next(false)
    } else {
      next()
    }
  },
  created() {
    // @ts-ignore
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },

  beforeDestroy() {
    // @ts-ignore
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },
  computed: {
    isDirty(): boolean {
      // The validation observer should have 'observer' ref
      // @ts-ignore
      return this.$refs.observer.fields.name.dirty
    },
  },
  methods: {
    confirmLeave(): boolean {
      return window.confirm(i18n.t('common.confirmLeave') as string)
    },

    confirmStayInDirtyForm(): boolean {
      // @ts-ignore
      return this.isDirty && !this.confirmLeave()
    },

    beforeWindowUnload(e: Event) {
      if (this.confirmStayInDirtyForm()) {
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = true
      }
    },
  },
}
