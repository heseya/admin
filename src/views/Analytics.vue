<template>
  <div>
    <top-nav title="Statystyki" subtitle="TODO"></top-nav>

    <app-button> Text </app-button>

    <app-button type="primary" loading>
      Text
      <i slot="icon" class="bx bxs-chevron-right"></i>
    </app-button>

    <app-button type="white">
      Text
      <i slot="icon" class="bx bxs-chevron-right"></i>
    </app-button>

    <app-button type="danger">
      Text
      <i slot="icon" class="bx bxs-chevron-right"></i>
    </app-button>
  </div>
</template>

<script lang="ts">
import TopNav from '@/components/layout/TopNav.vue'
import Vue from 'vue'
export default Vue.extend({
  metaInfo: { title: 'Statystyka' },
  components: { TopNav },
})
</script>
