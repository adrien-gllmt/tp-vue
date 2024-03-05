<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { movie, movies } = defineProps(['movie', 'movies']);
const selectedMovieId = ref(null);
const selectedMovie = ref(null);
const deleteSuccess = ref(false);

const toggleDetails = (id) => {
  selectedMovieId.value = id;
  selectedMovie.value = movies.find((movie) => movie.id === id);
};

const updateMovie = async () => {
  const token = localStorage.getItem('token');

  if (token && selectedMovie.value) {
    try {
      const response = await fetch(`http://149.91.80.19/symfony/public/api/movies/${selectedMovieId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedMovie.value),
      });

      const updateSuccessModal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
      updateSuccessModal.show();

      const updatedMovie = await response.json();
      const movieIndex = movies.findIndex((movie) => movie.id === selectedMovieId.value);
      movies[movieIndex] = updatedMovie;

      selectedMovieId.value = null;
      selectedMovie.value = null;
    } catch (error) {
      console.error(error.message);
    }
  }
};

const openDeleteModal = (id) => {
  selectedMovieId.value = id;
  const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
  deleteSuccessModal.show();

  // Appel à deleteMovie après 3 secondes
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && selectedMovieId.value) {
        const response = await fetch(`http://149.91.80.19/symfony/public/api/movies/${selectedMovieId.value}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          deleteSuccess.value = true;
          window.location.reload();
        } else {
          deleteSuccess.value = false;
        }
      }
    } catch (error) {
      console.error(error.message);
      deleteSuccess.value = false;
    }
  }, 1000);
};

const closeForm = () => {
  selectedMovieId.value = null;
  selectedMovie.value = null;
};

onMounted(() => {
  selectedMovieId.value = null;
  selectedMovie.value = null;
});

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
</script>

<template>
  <div class="card-wrapper">
    <div class="card mb-4">
      <div class="card-body">
        <h4 class="card-title">{{ movie.title }}</h4>
        <p class="card-text">{{ truncateText(movie.description, 150) }}</p>
        <p class="card-text"><strong>Durée:</strong> {{ movie.duration + "min" }}</p>
        <router-link :to="{ name: 'MovieDetail', params: { id: movie && movie.id }}" class="btn">Voir la fiche</router-link>
        <button v-if="route.path === '/movies'" type="button" class="btn" @click="toggleDetails(movie.id)">Modifier</button>
        <button v-if="route.path === '/movies'" type="button" class="btn delete" @click="openDeleteModal(movie.id)">Supprimer</button>

      </div>
    </div>

    <div class="card card-edit p-4" v-if="selectedMovie">
      <h2>{{ selectedMovie.title }}</h2>
      <form @submit.prevent="updateMovie">
        <div class="form-group mt-4">
          <label for="editMovieTitle">Titre du film :</label>
          <input type="text" class="form-control mt-1" id="editMovieTitle" v-model="selectedMovie.title" />
        </div>

        <div class="form-group mt-4">
          <label for="editMovieDescription">Description :</label>
          <textarea class="form-control mt-1" id="editMovieDescription" v-model="selectedMovie.description" rows="6"></textarea>
        </div>
        <div class="form-group mt-4">
          <label for="editMovieReleaseDate">Date de sortie :</label>
          <input type="date" class="form-control mt-1" id="editMovieReleaseDate" v-model="selectedMovie.release_date" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieDuration">Durée :</label>
          <input type="number" class="form-control mt-1" id="editMovieDuration" v-model="selectedMovie.duration" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieEntries">Nombre d'entrées :</label>
          <input type="number" class="form-control mt-1" id="editMovieEntries" v-model="selectedMovie.entries" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieBudget">Budget :</label>
          <input type="number" class="form-control mt-1" id="editMovieBudget" v-model="selectedMovie.budget" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieWebsite">Site web :</label>
          <input type="text" class="form-control mt-1" id="editMovieWebsite" v-model="selectedMovie.website" />
        </div>
        <div class="form-group mt-4">
          <label for="editMoviePoster">URL de l'affiche :</label>
          <input type="text" class="form-control mt-1" id="editMoviePoster" v-model="selectedMovie.poster" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieDirector">Réalisateur :</label>
          <input type="text" class="form-control mt-1" id="editMovieDirector" v-model="selectedMovie.director" />
        </div>

        <div class="my-3 mt-3">
          <button type="submit" class="btn">Modifier</button>
          <button type="button" class="btn" @click="closeForm">Fermer</button>
        </div>
      </form>
    </div>

    <div class="modal fade" id="updateSuccessModal" tabindex="-1" aria-labelledby="updateSuccessModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updateSuccessModalLabel">Mise à jour réussie</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Le film a été mis à jour avec succès !
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteSuccessModal" tabindex="-1" aria-labelledby="deleteSuccessModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteSuccessModalLabel">Suppression réussie</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ deleteSuccess ? 'Le film a été supprimé avec succès !' :'Le film a été supprimé avec succès '}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  width: 100%;
  background: #322d4b;
  color: white;

  &.border-warning {
    border-color: #ffc107;
    border-width: 10px;
  }
}
.card:hover {
  transform: scale(1.02);
}

.card-body {
  padding: 10px;
}

.card-title {
  font-size: 25px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
}

.card-text {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn {
  background: yellow;
  width: 100%;
}

.btn:hover {
  background: #afaf00;
  color: #322d4b;
}

.btn.delete {
  background: red;
}

.btn.delete:hover {
  background: #d00000;
}

.card-edit {
  border: none;
}
</style>
