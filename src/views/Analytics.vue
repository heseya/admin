<template>
  <div>
    <top-nav title="Statystyki" subtitle="TODO"></top-nav>

    <app-button> Text </app-button>

    <app-button type="primary" loading>
      Text
      <template #icon>
        <i class="bx bxs-chevron-right"></i>
      </template>
    </app-button>

    <app-button type="white">
      Text
      <template #icon>
        <i class="bx bxs-chevron-right"></i>
      </template>
    </app-button>

    <app-button type="danger">
      Text
      <template #icon>
        <i class="bx bxs-chevron-right"></i>
      </template>
    </app-button>
  </div>
</template>

<script lang="ts">
import TopNav from '@/components/layout/TopNav.vue'
import Vue from 'vue'
export default Vue.extend({
  components: { TopNav },
})
</script>
