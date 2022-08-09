import Vue from 'vue'
import i18n from '@/i18n'

/**
 * 1. Validate Observer should have 'observer' ref setted
 * 2. After form submitting Validate Observer should be resetted
 *  */
export default Vue.extend({
  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.confirmStayInDirtyForm()) {
      next(false)
    } else {
      next()
    }
  },

  computed: {
    isDirty(): boolean {
      // The validation observer should have 'observer' ref
      // @ts-ignore
      return this.$refs.observer.fields.name.dirty
    },
  },

  created() {
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },

  methods: {
    confirmLeave(): boolean {
      return window.confirm(i18n.t('common.confirmLeave') as string)
    },

    confirmStayInDirtyForm(): boolean {
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
})
