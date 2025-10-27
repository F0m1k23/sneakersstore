import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/catalog',
      name: 'Catalog',
      component: () => import('../pages/Catalog.vue'),
    },
    {
      path: '/catalog/:id',
      name: 'Product',
      component: () => import('../pages/ShowProduct.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../pages/Register.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../pages/Faq.vue'),
    },
    {
      path: '/basket',
      name: 'basket',
      component: () => import('../pages/Basket.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../pages/Checkout.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../pages/Orders.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Защита маршрутов, требующих авторизации
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
