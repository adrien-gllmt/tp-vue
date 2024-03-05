<script setup>
import { ref, onBeforeMount } from 'vue';
import router from "../router";
import MovieCard from '@/components/MovieCard.vue'
import ActorCard from '@/components/ActorCard.vue'

const movies = ref();
const actors = ref();

const token = localStorage.getItem('token');
const authenticationHeaders = { "Authorization": `Bearer ${token}`, "Accept": "application/ld+json" };

onBeforeMount(async () => {
  if (!token) {
    await router.push("/login");
  } else {
    try {
      let res = await fetch('http://149.91.80.19/symfony/public/api/movies', { headers: authenticationHeaders });
      res = await res.json();
      if (res.code === 401) {
        await router.push("/login");
      }
      movies.value = res["hydra:member"].slice(0, 4);
      //movies.value = await authenticatedFetch('http://149.91.80.19/symfony/public/api/movies', { headers: {"Accept": "application/json" }}, token);
      console.log(movies.value);
    } catch (e) {
      console.error(e);
    }

    try {
      let res = await fetch('http://149.91.80.19/symfony/public/api/actors', { headers: authenticationHeaders });
      res = await res.json();
      if (res.code === 401) {
        await router.push("/login");
      }
      actors.value = res["hydra:member"].slice(0, 4);
      console.log(actors.value);
    } catch (e) {
      console.error(e);
    }
  }
})
</script>

<template>
  <main>
    <div class="container my-5">
      <div class="my-5">
        <h2>Films populaires :</h2>
        <div class="card-container">
          <MovieCard v-for="movie in movies" :movie="movie" :key="movie.id" />
        </div>
      </div>
      <hr class="border-bottom border-dark my-2 fw-bold">
      <div class="my-5">
        <h2>Acteurs en tendance :</h2>
        <div class="card-container">
          <ActorCard v-for="actor in actors" :movie="actor" :key="actor.id" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  color: white;
}

.card-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  .card-wrapper {
    width: 50%;
  }
}
</style>