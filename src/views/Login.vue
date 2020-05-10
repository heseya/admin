<template>
  <div class="login">
    <card class="login__card">
      <h1 class="title">Logowanie</h1>
      <br /><br />
      <vs-input v-model="email" label="E-mail" type="email" />
      <br /><br />
      <vs-input v-model="password" label="Hasło" type="password" />
      <br />
      <vs-button color="dark" @click="login">
        Zaloguj
      </vs-button>
    </card>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'

export default {
  components: {
    Card
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    loginError() {
      return this.$store.state.auth.error
    }
  },
  watch: {
    loginError(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: 'Błąd logowania',
          text: 'Popraw email lub haslo'
        })
      }
    }
  },
  methods: {
    async login() {
      const loading = this.$vs.loading()
      await this.$store.dispatch('auth/login', {
        username: this.email,
        password: this.password
      })
      loading.close()
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &__card {
    width: 300px;

    input {
      width: 100%;
    }
  }
}

.nav {
  display: none;
}
</style>
