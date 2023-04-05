import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/foodgroup/:name',  // change to id
      name: 'foodgroup',
      component: () => import('../views/FoodGroup.vue')
    },
    {
      path: '/subfoodgroup/:name',  // change to id
      name: 'subfoodgroup',
      component: () => import('../views/SubFoodGroup.vue')
    },
    {
      path: '/food/:name',  // change to id
      name: 'food',
      component: () => import('../views/Food.vue')
    },
    {
      path: '/:notFound',
      name: 'not found',
      component: NotFound
    },
  ]
})

export default router
