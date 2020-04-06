<template>
  <div class="login">

    <card class="login__card">
      <h1 class="title">Logowanie</h1>
      <br><br>
      <vs-input v-model="email" label="E-mail" type="email"/>
      <br><br>
      <vs-input v-model="password" label="Hasło" type="password"/>
      <br>
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
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      const loading = this.$vs.loading()
      setTimeout(() => {
        loading.close()
      }, 3000)
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
