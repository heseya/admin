<template>
  <div class="login">
    <card class="login__card">
      <h1 class="title">Logowanie</h1>
      <br /><br />
      <vs-input v-model="email" label="E-mail" type="email" @keydown.enter="login" />
      <br /><br />
      <vs-input v-model="password" label="Hasło" type="password" @keydown.enter="login" />
      <br />
      <vs-button color="dark" @click="login"> Zaloguj </vs-button>
    </card>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'

const DEBUG = process.env.NODE_ENV === 'development'

export default {
  components: {
    Card,
  },
  data() {
    return {
      email: DEBUG ? '***REMOVED***' : '',
      password: DEBUG ? '***REMOVED***' : '',
    }
  },
  computed: {
    loginError() {
      return this.$store.state.auth.error
    },
  },
  watch: {
    loginError(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: 'Błąd logowania',
          text: 'Zły email lub hasło.',
        })
      }
    },
  },
  methods: {
    async login() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
      })
      loading.close()
      this.$router.push({ name: 'Home' })
    },
  },
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
</style>
