import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/food/:name',  // change to id
      name: 'food',
      component: () => import('@/views/FoodView.vue')
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: () => import('@/views/RecipeView.vue')
    },
    {
      path: '/:notFound',
      name: 'not found',
      component: () => import('@/views/NotFound.vue')
    },
  ]
})

export default router
