import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "../stores/auth";
import MainLayout from '../layouts/MainLayout.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import KelolaUser from '../views/KelolaUserView.vue';
import Kategori from '../views/CategoryView.vue'
import SuratMasuk from '../views/SuratMasukView.vue';
import SuratKeluar from '../views/SuratKeluarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      component: MainLayout, // MainLayout sebagai layout dasar
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          meta: { requiresAuth: true },
        },
        {
          path: 'kelola-user',
          name: 'kelola-user',
          component: KelolaUser,
          meta: { requiresAuth: true },
        },
        {
          path: 'kategori',
          name: 'kategori',
          component: Kategori,
          meta: { requiresAuth: true },
        },
        {
          path: 'surat-masuk',
          name: 'surat-masuk',
          component: SuratMasuk,
          meta: { requiresAuth: true },
        },
        {
          path: 'surat-keluar',
          name: 'surat-keluar',
          component: SuratKeluar,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' }); // Redirect ke halaman login jika belum login
  } else {
    next();
  }
});

export default router;
