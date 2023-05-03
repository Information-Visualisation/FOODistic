import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // {
    //   path: '/foodgroup/:name',  // change to id
    //   name: 'foodgroup',
    //   component: () => import('../views/FoodGroup.vue')
    // },
    // {
    //   path: '/subfoodgroup/:name',  // change to id
    //   name: 'subfoodgroup',
    //   component: () => import('../views/SubFoodGroup.vue')
    // },
    {
      path: '/food/:name',  // change to id
      name: 'food',
      component: () => import('../views/FoodView.vue')
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: () => import('../views/RecipeView.vue')
    },
    {
      path: '/test_page',
      name: 'Test page',
      component: () => import('../views/TestPage.vue')
    },
    {
      path: '/:notFound',
      name: 'not found',
      component: () => import('../views/NotFound.vue')
    },
  ]
})

export default router