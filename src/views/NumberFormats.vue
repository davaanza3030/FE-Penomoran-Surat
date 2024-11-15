<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Manage Number Formats</h1>

    <!-- Form Format -->
    <form @submit.prevent="submitFormat" class="mb-6 space-y-4">
      <div>
        <label
          for="format_string"
          class="block text-sm font-medium text-gray-700"
          >Format String:</label
        >
        <input
          v-model="state.form.format_string"
          id="format_string"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 focus:outline-none"
        >
          {{ state.isEditing ? "Update" : "Add" }} Format
        </button>
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow hover:bg-gray-400 focus:outline-none"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Daftar Format -->
    <div v-if="state.loading" class="text-gray-600">Loading formats...</div>
    <div v-if="state.error" class="text-red-500">{{ state.error }}</div>

    <table
      v-if="!state.loading && !state.error"
      class="min-w-full table-auto bg-white rounded-md shadow-md"
    >
      <thead>
        <tr>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            ID
          </th>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Format String
          </th>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="format in state.formats" :key="format.id" class="border-t">
          <td class="px-4 py-2">{{ format.id }}</td>
          <td class="px-4 py-2">{{ format.format_string }}</td>
          <td class="px-4 py-2">
            <button
              @click="editFormat(format)"
              class="text-indigo-600 hover:text-indigo-900 mr-2"
            >
              Edit
            </button>
            <button
              @click="deleteFormat(format.id)"
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useNumberFormatStore } from "../stores/numberFormatStore";
import { onMounted } from "vue";

// Inisialisasi store
const numberFormatStore = useNumberFormatStore();
const state = numberFormatStore.state;

// Load data format saat komponen di-mount
onMounted(() => {
  numberFormatStore.loadFormats();
});

// Fungsi-fungsi dari store
const submitFormat = numberFormatStore.submitFormat;
const editFormat = numberFormatStore.editFormat;
const deleteFormat = numberFormatStore.deleteFormat;
const resetForm = numberFormatStore.resetForm;
</script>

<style scoped>
/* Tambahkan styling jika diperlukan */
</style>
