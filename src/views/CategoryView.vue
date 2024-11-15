<template>
  <div class="view-container flex-1 bg-white p-6 mx-4 mt-20 mb-6 rounded-xl shadow-md">
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Manage Categories</h1>

      <form @submit.prevent="submitCategory" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-black">Category Name:</label>
          <input v-model="state.form.name" id="name" type="text" required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
        </div>

        <div class="flex space-x-2">
          <button type="submit"
            class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none">
            {{ state.isEditing ? "Update" : "Add" }} Category
          </button>
          <button type="button" @click="resetForm"
            class="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow hover:bg-gray-400 focus:outline-none">
            Reset
          </button>
        </div>
      </form>

      <hr class="my-6 border-t-2 border-gray-200" />

      <div v-if="state.loading" class="text-gray-600">Loading categories...</div>
      <div v-if="state.error" class="text-red-500">{{ state.error }}</div>

      <table v-if="!state.loading && !state.error"
        class="min-w-full table-auto border-collapse bg-white text-black border border-gray-400 rounded-md shadow-md">
        <thead class="bg-blue-500">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-white uppercase border border-gray-400">ID</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-white uppercase border border-gray-400">Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-white uppercase border border-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white text-black">
          <tr v-for="(category, index) in state.categories" :key="category.id"
            :class="{ 'bg-blue-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }">
            <td class="px-4 py-2 whitespace-nowrap border border-gray-400">{{ category.id }}</td>
            <td class="px-4 py-2 whitespace-nowrap border border-gray-400">{{ category.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap border border-gray-400">
              <button @click="editCategory(category)" class="text-blue-400 hover:text-blue-500 mr-2">Edit</button>
              <button @click="deleteCategory(category.id)" class="text-red-400 hover:text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from "../stores/categoryStore";

const categoryStore = useCategoryStore();
const state = categoryStore.state;
const submitCategory = categoryStore.submitCategory;
const editCategory = categoryStore.editCategory;
const deleteCategory = categoryStore.deleteCategory;
const resetForm = categoryStore.resetForm;

categoryStore.loadCategories();
</script>

<style scoped>
/* Tambahan styling jika diperlukan */
</style>
