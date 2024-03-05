<template>
  <div class="container mt-5">
    <div v-if="movieData">
      <div class="card">
        <div class="card-body">
            <div>
              <p><strong>Titre:</strong> {{ movieData.title }}</p>
              <p v-if="movieData.Category?.name"><strong>Catégorie</strong> {{ movieData.Category?.name }}</p>
              <p><strong>Réalisateur:</strong> {{ movieData.director }}</p>
              <p><strong>Date de sortie:</strong> {{ formatDate(movieData.releaseDate) }}</p>
              <p><strong>Durée:</strong> {{ movieData.duration }} min</p>
              <p><strong>Nombre d'entrées:</strong> {{ movieData.entries }}</p>
              <p><strong>Budget:</strong> {{ movieData.budget }} €</p>
              <p><strong>Site web:</strong> {{ movieData.website }}</p>
              <p>{{ movieData.description }}</p>
            </div>
          <h4 class="mt-4">Acteurs</h4>
          <div class="card-flex">
            <ActorCard v-for="movie in movieData.actors" :key="movie.id" :movie="movie" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import ActorCard from '@/components/ActorCard.vue'

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const movieData = ref(null);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const id = useRoute().params.id;
      const response = await fetch(`http://149.91.80.19/symfony/public/api/movies/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      movieData.value = jsonData;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

onMounted(async () => {
  await AuthenticationRequest();
});
</script>

<style scoped>
.card {
  color: white;
  background: #322d4b;
  border: none;
}

.card-flex {
  display: flex;
  gap: 20px;
}
</style>
