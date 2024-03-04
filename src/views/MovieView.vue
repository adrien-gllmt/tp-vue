<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import MovieCard from '@/components/MovieCard.vue';

// const token = localStorage.getItem('token');
// if (!token) {
//   await router.push("/login");
// }

const movies = ref([]);
const searchInput = ref("");
const totalPages = ref(0);
const currentPage = ref(1);
const itemsPerPage = 8;

const showSuccessModal = ref(false);

const allCategories = ref([]);
const allActors = ref([]);
const newMovie = ref({
  title: "",
  release_date: null,
  description: "",
  duration: "",
  note : "",
  entries: "",
  budget: "",
  director: "",
  website: "",
});

const fetchAllCategories = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/categories`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      allCategories.value = jsonData["hydra:member"];
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

const fetchAllActors = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/actors`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      allActors.value = jsonData["hydra:member"];
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

const addMovie = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      //const actorIds = newMovie.value.actors.map(actor => `/api/actors/${actor.id}`);
      //const CategoryId = `/api/categories/${newMovie.value.category.id}`;

      console.log('Data being sent to the server:', {
        title: newMovie.value.title,
        release_date: new Date().toISOString(),
        description: newMovie.value.description,
        duration: newMovie.value.duration,
        note: newMovie.value.note,
        entries: newMovie.value.entries,
        budget: newMovie.value.budget,
        director: newMovie.value.director,
        website: newMovie.value.website,
      });

      const response = await fetch('http://localhost:8000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          release_date: new Date().toISOString(),
          description: newMovie.value.description,
          duration: newMovie.value.duration,
          note: newMovie.value.note,
          entries: newMovie.value.entries,
          budget: newMovie.value.budget,
          director: newMovie.value.director,
          website: newMovie.value.website,
          title: newMovie.value.title,
        }),
      });

      const jsonData = await response.json();

      if (jsonData.code === 401) {
        await router.push('/login');
        console.log('Vous n\'êtes pas connecté');
      }

      // Affichez un message de succès, réinitialisez le formulaire, etc.
      console.log('Film ajouté avec succès!');
      newMovie.value = {
        title: '',
        year: null,
        actors: [],
        Category: null,
      };

    } catch (error) {
      console.error('Erreur lors de l\'ajout du film:', error);
    }
  } else {
    console.log('Vous n\'êtes pas connecté');
  }
};
const closeModal = () => {
  showSuccessModal.value = false;
};


const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/movies`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage.value,

          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
      }
      movies.value = jsonData["hydra:member"];
      console.log(movies.value);
      updatePagination();
    } catch (error) {
      console.log(error);
    }
  }
};

const autoSearch = async () => {
  if (searchInput.value.trim() !== "") {
    await search();
  } else {
    await AuthenticationRequest();
  }
};

const search = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/movies?title=${searchInput.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      movies.value = jsonData["hydra:member"];
      updatePagination();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

onMounted(async () => {
  await AuthenticationRequest();
  await fetchAllActors();
  await fetchAllCategories();
});

const changePage = async (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    updatePagination();
  }
};

const updatePagination = () => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // paginatedMovies.value = movies.value.slice(startIndex, endIndex);
  totalPages.value = Math.ceil(movies.value.length / itemsPerPage);
};
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Films</h1>
    <form class="d-flex mb-4">
      <div class="input-group">
        <input class="form-control" type="search" placeholder="Recherche" aria-label="Recherche" v-model="searchInput" @input="autoSearch" />
        <button class="btn btn-outline-success" type="submit">Rechercher</button>
      </div>
    </form>
    <button class="btn btn-primary mt-2 mb-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFomMovie" aria-expanded="false" aria-controls="collapseExample">
      Ajouter un film
    </button>

    <div class="collapse mb-4" id="collapseFomMovie">
      <div class="card card-body">
        <form @submit.prevent="addMovie" class="mb-2 p-2">
          <h2 class="text-center my-4">Remplir les informations du nouveau film</h2>
          <div class="form-group mt-2">
            <label for="title">Titre:</label>
            <input type="text" class="form-control mt-1" v-model="newMovie.title" required />
          </div>
          <div class="form-group mt-2">
            <label for="description">Description</label>
            <textarea class="form-control" rows="6" v-model="newMovie.description" required></textarea>
          </div>
          <div class="form-group mt-2">
            <label for="note">Note:</label>
            <input type="number" class="form-control mt-1" v-model="newMovie.note" required />
          </div>
          <div class="form-group mt-2">
            <label for="release_date">Année de sortie:</label>
            <input type="date" class="form-control mt-1" v-model="newMovie.release_date" required />
          </div>
          <div class="form-group mt-2">
            <label for="director">Réalisateur:</label>
            <input type="text" class="form-control mt-1" v-model="newMovie.director" required />
          </div>
          <div class="form-group mt-2">
            <label for="duration">Durée:</label>
            <input type="number" min='0' max='500' class="form-control mt-1" v-model="newMovie.duration" required />
          </div>
          <div class="form-group mt-2">
            <label for="entries">Nombre d'entrées:</label>
            <input type="number" class="form-control mt-1" v-model="newMovie.entries" required />
          </div>
          <div class="form-group mt-2">
            <label for="budget">Budget:</label>
            <input type="number" class="form-control mt-1" v-model="newMovie.budget" placeholder="10000€" required />
          </div>
          <div class="form-group mt-2">
            <label for="website">Site web:</label>
            <input type="url" class="form-control mt-1" v-model="newMovie.website" required />
          </div>
<!--          <div class="form-group mt-2 d-none">-->
<!--            <label class="mb-1">Acteurs:</label>-->
<!--            <div v-for="actor in allActors" :key="actor.id" class="form-check">-->
<!--              <input type="checkbox" :id="`actor-${actor.id}`" v-model="newMovie.actors" :value="actor" class="form-check-input "  />-->
<!--              <label :for="`actor-${actor.id}`" class="form-check-label">{{ actor.firstName }} {{ actor.lastName }}</label>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group my-2 d-none">-->
<!--            <label for="category">Catégorie:</label>-->
<!--            <select class="form-control mt-1" v-model="newMovie.category" required>-->
<!--              <option v-for="category in allCategories" :key="category.id" :value="category">@{{ category.name }}</option>-->
<!--            </select>-->
<!--          </div>-->
              <div class="form-group">
                <button type="submit" class="btn btn-primary mt-4">Ajouter</button>
              </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6" v-for="movie in movies" :key="movie.id">
        <MovieCard :movie="movie" :movies="movies" />
      </div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" @click="changePage(-1)" :disabled="currentPage === 1" aria-label="Précédent">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"><a class="page-link">{{ currentPage }} / {{ totalPages }}</a></li>
        <li class="page-item">
          <a class="page-link" @click="changePage(1)" :disabled="currentPage === totalPages" aria-label="Suivant">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <div v-if="showSuccessModal" class="modal" id="successModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Succès!</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Le film a été ajouté avec succès!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

form {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
}

.form-control {
  flex: 1;
  margin-right: 10px;
}

.btn-outline-success {
  background-color: #28a745;
  color: #fff;
}

.page-item {
  display: inline-block;
  margin-right: 10px;
}

.page-link {
  color: #28a745;
  border-color: #28a745;
}

.page-link:hover {
  background-color: #28a745;
  color: #fff;
  border-color: #28a745;
}
</style>
