<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>

      <form @submit.prevent="submitLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
          :disabled="isLoggingIn"
        >
          <span v-if="isLoggingIn">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isLoggingIn = ref(false);

const submitLogin = async () => {
  if (email.value && password.value) {
    try {
      await authStore.login({ email: email.value, password: password.value });
    } catch (error) {
      console.error("Login failed:", error);
    }
  } else {
    console.log("Please fill in the form");
  }
};
</script>
