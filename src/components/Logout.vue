<script setup>
import router from '@/router/index.js'

const token = localStorage.getItem('token');

function logout() {
  localStorage.removeItem('token');
  console.log('Vous êtes déconnecté');
  router.push('/login'); // Rediriger vers la page de connexion après la déconnexion.
}
</script>

<template>
  <div class="">
    <button v-if="token" @click="logout" class="btn text-white">Déconnexion</button>
  </div>
</template>

<style scoped>

</style>