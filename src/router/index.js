import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Login.vue'
import MovieView from '@/views/MovieView.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import ActorView from '@/views/ActorView.vue'
import ActorDetail from '@/views/ActorDetail.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/movies',
      name: 'MovieView',
      component: MovieView,
    },
    {
      path: '/MovieDetail/:id',
      name: 'MovieDetail',
      component: MovieDetail,
    },
    {
      path: '/actors',
      name: 'actors',
      component: ActorView
    },
    {
      path: '/actors/:id',
      name: 'actorDetail',
      component: ActorDetail
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryView
    }
  ]
})

export default router
