<script setup xmlns="http://www.w3.org/1999/html">

import {ref} from 'vue'
import { useRouter } from 'vue-router'

const email = ref(null);
const password = ref(null);
const router = useRouter();

// Définissez votre variable d'URL de connexion ici
const loginUrl = 'http://localhost:8000/api/login_check';

async function login() {
  try {
    let res = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value
      })
    });

    if (res.ok) {
      res = await res.json();
      localStorage.setItem('token', res.token);
      await router.push('/')
    }

  } catch (error) {
    console.error(error.message)
  }
}
</script>

<template>
  <div class="container">
    <div class="d-flex align-items-center justify-content-center">
      <div class="col-3 mt-5">
        <h1>Connexion</h1>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control" v-model="email" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input type="password" class="form-control" v-model="password">
          </div>
          <button type="submit" class="btn btn-primary">Se connecter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>