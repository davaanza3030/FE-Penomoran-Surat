<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 rounded-r-2xl p-2 z-20">
      <div class="p-4 text-lg font-bold text-black">
        Dapa
      </div>
      <ul class="mt-4 space-y-4">
        <li class="px-4 py-2 hover:bg-gray-200">
          <router-link to="/" class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="w-6 h-6" />
            <span class="text-base font-medium text-gray-800">Dashboard</span>
          </router-link>
        </li>
        <li v-if="role === 'admin'" class="px-4 py-2 hover:bg-gray-200">
          <router-link to="/kelola-user" class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'user']" class="w-6 h-6" />
            <span class="text-base font-medium text-gray-800">Kelola User</span>
          </router-link>
        </li>
        <li v-if="role === 'admin'" class="px-4 py-2 hover:bg-gray-200">
          <router-link to="/kategori" class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'list-alt']" class="w-6 h-6" />
            <span class="text-base font-medium text-gray-800">Kategori</span>
          </router-link>
        </li>
        <li class="px-4 py-2 hover:bg-gray-200">
          <router-link to="/surat-masuk" class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'envelope']" class="w-6 h-6" />
            <span class="text-base font-medium text-gray-800">Surat Masuk</span>
          </router-link>
        </li>
        <li class="px-4 py-2 hover:bg-gray-200">
          <router-link to="/surat-keluar" class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="w-6 h-6" />
            <span class="text-base font-medium text-gray-800">Surat Keluar</span>
          </router-link>
        </li>
      </ul>
    </aside>

    <!-- Content Wrapper -->
    <div class="flex-1 ml-64 flex flex-col">
      <!-- Navbar/Header -->
      <header class="bg-white text-black py-4 px-6 mx-3 border-b border-gray-300 fixed top-0 left-64 right-0 z-30 rounded-xl">
        <div class="flex justify-between items-center">
          <div class="text-lg font-bold">Penomoran Surat</div>
          <div class="relative">
            <span class="font-sans text-lg cursor-pointer" @click="toggleDropdown">
              Hai, {{ username }}
            </span>
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              <a class="block px-4 py-2 text-black hover:bg-gray-200">Role: {{ role }}</a>
              <a @click="handleLogout" class="block px-4 py-2 text-black hover:bg-gray-200">Logout</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div class="flex-1 flex overflow-y-auto p-4 sm:p-6 w-full">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "@/utility/apiService";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTachometerAlt, faUser, faListAlt, faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

library.add(faTachometerAlt, faUser, faListAlt, faEnvelope, faPaperPlane);

const username = ref("");
const role = ref("");
const dropdownOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    const response = await apiService.apiPost("/auth/me");
    username.value = response.data.username;
    role.value = response.data.role;
  } catch (error) {
    console.error("Gagal mengambil informasi user:", error);
  }
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout(); // Call logout from authStore
  } catch (error) {
    console.error("Gagal logout:", error);
  }
};
</script>

<style scoped>
/* Hanya menggunakan Tailwind CSS dan tidak ada style tambahan */
</style>
