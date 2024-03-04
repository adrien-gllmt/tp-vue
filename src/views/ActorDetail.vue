<template>
  <div class="container mt-5">
    <div v-if="movieData">
      <h1 class="display-4">{{ movieData.title }}</h1>
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <img :src="movieData.poster" alt="Movie Poster" class="img-fluid rounded" />
            </div>
            <div class="col-md-6">
              <ul class="list-unstyled">
                <li><strong>Nom :</strong> {{ movieData.firstName }} {{ movieData.lastName }}</li>
                <li><strong>Date de naissance :</strong> {{ movieData.birthday }}</li>
                <li><strong>Nationalité :</strong> {{ movieData.nationality.name }}</li>
              </ul>
              <p class="lead">{{ movieData.description }}</p>
            </div>
          </div>
          <h4 class="mt-4">Films</h4>
          <MovieCard v-for="movie in movieData.movies" :key="movie.id" :movie="movie" />
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
      const response = await fetch(`http://localhost:8000/api/actors/${id}`, {
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
}

.list-unstyled {
  list-style: none;
  padding: 0;
}

.list-inline {
  padding: 0;
}

.list-inline-item {
  margin-right: 10px;
  font-size: 1.1em;
}

.display-4 {
  font-size: 2.5em;
  font-weight: bold;
}

.lead {
  font-size: 1.2em;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>
