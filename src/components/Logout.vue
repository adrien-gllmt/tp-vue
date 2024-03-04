<script setup>
import router from '@/router/index.js'

function logout() {
  localStorage.removeItem('token');
  console.log('Vous êtes déconnecté');
  router.push('/login'); // Rediriger vers la page de connexion après la déconnexion.
}
</script>

<template>
  <div class="">
    <button @click="logout" class="btn btn-danger">Se déconnecter</button>
  </div>
</template>

<style scoped>

</style>