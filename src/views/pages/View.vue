<template>
<div>
  <top-nav :title="page.name">
    <vs-tooltip bottom shadow not-hover v-model="deleteConfirm">
      <vs-button dark icon @click="deleteConfirm =! deleteConfirm">
        <i class="bx bx-trash"></i>
      </vs-button>
      <template #tooltip>
        <div class="content-tooltip">
          <p>Czy na pewno chcesz usunąć tą stronę?</p>
          <footer>
            <vs-button @click="deleteConfirm = false" danger block>
              Usuń
            </vs-button>
            <vs-button @click="deleteConfirm = false" transparent dark block>
              Anuluj
            </vs-button>
          </footer>
        </div>
      </template>
    </vs-tooltip>
  </top-nav>

  <div class="page">

    <card>
      <div class="page__info">
        <vs-input v-model="page.name" label="Nazwa"/>
        <vs-input v-model="page.slug" label="Link"/>
        <flex-input>
          <label class="title">Widoczność strony</label>
          <vs-switch @click="changePublic" success v-model="page.public" :loading="activeLoading">
            <template #off>
              <i class='bx bx-x' ></i>
            </template>
            <template #on>
              <i class='bx bx-check' ></i>
            </template>
          </vs-switch>
        </flex-input>
      </div>
      <br>
      <editor
        height="500px"
        :options="editorOptions"
        initialEditType="wysiwyg"
        :initialValue="page.content"
      />
      <br>
      <vs-button color="dark" size="large" @click="openNotification(null, 'success')">
        Zapisz
      </vs-button>
    </card>

  </div>

</div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import FlexInput from '@/components/FlexInput.vue'

export default {
  components: {
    TopNav,
    Card,
    FlexInput,
    Editor
  },
  data () {
    return {
      deleteConfirm: false,
      activeLoading: false,
      editorOptions: {
        language: 'pl-PL'
      }
    }
  },
  computed: {
    page () {
      return this.$store.getters['pages/getSelected']
    }
  },
  methods: {
    openNotification (position = null, color) {
      return this.$vs.notification({
        color,
        position,
        title: 'Produkt został zaktualizowany.'
      })
    },
    changePublic () {
      this.activeLoading = true

      setTimeout(() => {
        this.activeLoading = false
      }, 3000)
    }
  },
  async created () {
    const loading = this.$vs.loading({ color: '#000' })

    try {
      await this.$store.dispatch('pages/get', this.$route.params.id)
    } catch (e) {
      console.log(e)
    } finally {
      loading.close()
    }
  }
}
</script>

<style lang="scss">
.page__info {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 30px 30px 20px;
    row-gap: 20px;
    margin-top: 15px;

  input {
    width: 100%;
  }

  .vs-select-content {
    max-width: none;
  }
}

.content-tooltip {
  footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (min-width: $break) {
  .page__info {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    grid-template-rows: 1fr;
    row-gap: 0;
  }
}
</style>
