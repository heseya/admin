<template>
  <div>
    <top-nav title="Strony">

      <vs-button to="/pages/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>

    </top-nav>

    <card>
      <div class="list">
        <template v-for="page in pages">
          <router-link :to="`/pages/${page.id}`" class="list__item" :key="page.id">
            <div class="list__item__avatar">
              <vs-avatar dark>
                <template #text>
                  {{ page.name }}
                </template>
              </vs-avatar>
            </div>
            <div>
              <div>
                <i v-if="!page.public" class="bx bx-lock-alt"></i>
                {{ page.name }}
              </div>
              <small>/{{ page.slug }}</small>
            </div>
          </router-link>
        </template>
      </div>
    </card>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'

export default {
  components: {
    TopNav,
    Card
  },
  computed: {
    pages () {
      return this.$store.state.pages.pages
    }
  },
  methods: {
    async getPages () {
      const loading = this.$vs.loading({ color: '#000' })

      try {
        await this.$store.dispatch('pages/index')
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    }
  },
  created () {
    this.getPages()
  }
}
</script>

<style lang="scss">
.list {

  &__item {
    border-radius: 20px;
    padding: 15px 10px;
    font-family: $font-sec;
    font-size: 17px;
    display: flex;
    text-decoration: none;
    color: black;

    &:hover {
      background-color: $grey-light;
    }

    small {
      color: #aaa;
    }

    &__avatar {
      margin-right: 13px;
    }
  }
}

@media (min-width: $break) {
  .list {
    padding: 10px 24px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .list__item:hover {
    background-color: none;
  }
}
</style>
