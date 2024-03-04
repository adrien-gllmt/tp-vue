<script setup>
import Logout from '@/components/Logout.vue';
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light px-5 bg-info">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"><a class="navbar-brand fw-bold text-white">Movie-Hub</a></router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item d-flex justify-content-center align-items-center">
            <router-link class="navbar-brand" to="/movies"><a class="nav-link" aria-current="page" href="#">Film</a></router-link>
          </li>
          <li class="nav-item d-flex justify-content-center align-items-center">
            <router-link class="navbar-brand" to="/actors"><a class="nav-link" aria-current="page" href="#">Acteurs</a></router-link>
          </li>
          <li class="nav-item d-flex justify-content-center align-items-center">
            <router-link class="navbar-brand" to="/categories"><a class="nav-link" aria-current="page" href="#">Catégories</a></router-link>
          </li>
        </ul>
      </div>
      <Logout />
    </div>
  </nav>
</template>

<style scoped>

</style>