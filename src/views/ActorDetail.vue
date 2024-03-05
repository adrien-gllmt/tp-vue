<template>
  <div class="container mt-5">
    <div v-if="movieData">
      <div class="card">
        <div class="card-body">
          <div>
            <p><strong>Nom :</strong> {{ movieData.firstName }} {{ movieData.lastName }}</p>
            <p><strong>Date de naissance :</strong> {{ formatDate(movieData.birthday) }}</p>
            <p><strong>Nationalité :</strong> {{ movieData.nationality.name }}</p>
          </div>
          <h4 class="mt-4">Films</h4>
          <div class="card-flex">
            <MovieCard v-for="movie in movieData.movies" :key="movie.id" :movie="movie" />
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
import MovieCard from '@/components/MovieCard.vue'

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
      const response = await fetch(`http://149.91.80.19/symfony/public/api/actors/${id}`, {
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
.container {
  max-width: 800px;
}

.card {
  margin-top: 20px;
  background: #322d4b;
  border: none;
  color: white;
}

.card-flex {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
