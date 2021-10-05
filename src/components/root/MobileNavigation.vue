<template>
  <div>
    <div class="mobile-nav" :class="{ 'mobile-nav--hidden': isHidden }">
      <router-link class="mobile-nav__link" to="/" exact>
        <InlineSvg
          class="nav-link-img"
          :src="require('@/assets/images/icons/dashboard-icon.svg')"
        />
        <span class="mobile-nav__link-label">Dashboard</span>
      </router-link>

      <router-link v-can="$p.Orders.Show" class="mobile-nav__link" to="/orders">
        <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/orders-icon.svg')" />
        <span class="mobile-nav__link-label">Zamówienia</span>
      </router-link>

      <!-- <router-link class="mobile-nav__link" to="/analytics">
        <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/stats-icon.svg')" />
        <span class="mobile-nav__link-label">Statystyka</span>
      </router-link> -->

      <button class="mobile-nav__link" @click="isMenuVisible = true">
        <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/more-icon.svg')" />
        <span class="mobile-nav__link-label">Więcej</span>
      </button>
    </div>

    <mobile-overlay :is-visible="isMenuVisible" @close="isMenuVisible = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import InlineSvg from 'vue-inline-svg'
import MobileOverlay from './MobileOverlay.vue'

export default Vue.extend({
  name: 'Navigation',
  components: { InlineSvg, MobileOverlay },
  data: () => ({
    isMenuVisible: false,
  }),
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
  },
})
</script>

<style lang="scss" scoped>
.mobile-nav {
  z-index: $mobile-nav-z-index;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  box-sizing: border-box;
  width: 100vw;
  background: #ffffff;
  border-top: solid 1px $primary-color-200;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: 0.3s;

  &--hidden {
    transform: translateY(60px);
  }

  &__link {
    all: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    padding: 4px 12px;
    border-radius: 8px;

    .nav-link-img {
      color: #9ea5b4;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
    }

    &.router-link-active {
      color: $primary-color-500;

      .nav-link-img {
        color: $primary-color-500;
      }
    }
  }

  &__link-label {
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
  }
}
</style>
