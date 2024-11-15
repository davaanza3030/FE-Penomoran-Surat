<template>
  <div class="view-container flex-1 bg-white p-6 mx-4 mt-20 mb-6 rounded-xl shadow-md">
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Kelola User</h1>

      <form @submit.prevent="submitUser" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-black">Nama</label>
          <input v-model="state.form.username" type="text" id="username" placeholder="Nama Pengguna" required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-black">Email</label>
          <input v-model="state.form.email" type="email" id="email" placeholder="Email Pengguna" required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-black">Password</label>
          <input v-model="state.form.password" type="password" id="password" placeholder="Password Pengguna"
            :required="!state.isEditing"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
        </div>
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-black">Konfirmasi Password</label>
          <input v-model="state.form.password_confirmation" type="password" id="password_confirmation"
            placeholder="Konfirmasi Password Pengguna" :required="!state.isEditing"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-black">Role</label>
          <select v-model="state.form.role" id="role"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black">
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <button type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {{ state.isEditing ? "Update User" : "Tambah User" }}
        </button>
      </form>

      <hr class="my-6 border-t-2 border-gray-200" />

      <table class="min-w-full table-auto border-collapse bg-white text-black border border-gray-400">
        <thead class="bg-blue-500">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-400">
              Nama
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-400">
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-400">
              Role
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-400">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white text-black">
          <tr v-for="(user, index) in state.users" :key="user.id"
            :class="{ 'bg-blue-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }">
            <td class="px-6 py-4 whitespace-nowrap border border-gray-400">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap border border-gray-400">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap border border-gray-400">{{ user.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap border border-gray-400">
              <button @click="editUser(user)" class="text-blue-400 hover:text-blue-500 mr-2">
                Edit
              </button>
              <button @click="deleteUser(user.id)" class="text-red-400 hover:text-red-500">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const state = userStore.state;

const submitUser = userStore.submitUser;
const editUser = userStore.editUser;
const deleteUser = userStore.deleteUser;

userStore.loadUsers();
</script>
