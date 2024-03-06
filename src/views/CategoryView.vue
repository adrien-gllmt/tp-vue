<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import CategoryCard from '@/components/CategoryCard.vue';

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
  firstName: "",
  lastName: "",
  birthday: null,
  nationality: ""
});

const fetchAllCategories = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://149.91.80.19/symfony/public/api/categories`,
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
        `http://149.91.80.19/symfony/public/api/actors`,
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

      const response = await fetch('http://149.91.80.19/symfony/public/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMovie.value),
      });

      const jsonData = await response.json();

      if (jsonData.code === 401) {
        await router.push('/login');
      }

      newMovie.value = {
        title: '',
        year: null,
        actors: [],
        Category: null,
      };

    } catch (error) {
      console.error('Erreur', error);
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
        `http://149.91.80.19/symfony/public/api/categories`,
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
        `http://149.91.80.19/symfony/public/api/categories?name=${searchInput.value}`,
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
    <h1 class="text-center text-white">Catégories</h1>
    <form class="d-flex mb-4">
      <div class="input-group">
        <input class="form-control" type="search" placeholder="Recherche" aria-label="Recherche" v-model="searchInput" @input="autoSearch" />
        <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFomMovie" aria-expanded="false" aria-controls="collapseExample">
          Ajouter une categorie
        </button>
      </div>
    </form>

    <div class="collapse mb-4" id="collapseFomMovie">
      <div class="card">
        <form @submit.prevent="addMovie" class="mb-2 p-2">
          <h2 class="text-center my-4">Ajouter une catégorie :</h2>
          <div class="form-group mt-2">
            <label for="title">Nom :</label>
            <input type="text" class="form-control mt-1" v-model="newMovie.name" required />
          </div>
          <div class="form-group">
            <button type="submit" class="btn mt-4">Créer</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6" v-for="movie in movies" :key="movie.id">
        <CategoryCard :movie="movie" :movies="movies" />
      </div>
    </div>

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

.btn {
  background: yellow;
}

.btn:hover {
  background: #afaf00;
  color: #322d4b;
}

#collapseFomMovie .card {
  background: #322d4b;
  color: white;
  border: none;

  input, textarea {
    background: transparent;
  }
}
</style>
