import { defineStore } from "pinia";
import { reactive } from "vue";
import { apiService } from "../utility/apiService";
import handleError from "../utility/errorHandler"; // Import error handler

export const useUserStore = defineStore("userStore", () => {
  const state = reactive({
    users: [],
    form: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "staff",
    },
    isEditing: false,
    selectedUserId: null,
    loading: false,
    error: null,
  });

  const loadUsers = async () => {
    state.loading = true;
    state.error = null;
    try {
      const response = await apiService.apiGet("/kelola-user");
      state.users = response.data;
    } catch (error) {
      handleError(error); // Menangani error dengan error handler
      state.error = "Gagal memuat user"; // Simpan pesan error di state jika perlu
    } finally {
      state.loading = false;
    }
  };

  const addUser = async () => {
    try {
      await apiService.apiPost("/kelola-user", state.form);
      await loadUsers();
      resetForm();
    } catch (error) {
      handleError(error); // Menangani error dengan error handler
      state.error = "Gagal menambah user"; // Simpan pesan error di state
    }
  };

  const updateUser = async () => {
    try {
      await apiService.apiPut(
        `/kelola-user/${state.selectedUserId}`,
        state.form
      );
      await loadUsers();
      resetForm();
    } catch (error) {
      handleError(error); // Menangani error dengan error handler
      state.error = "Gagal mengupdate user"; // Simpan pesan error di state
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await apiService.apiDelete(`/kelola-user/${id}`);
      await loadUsers();
    } catch (error) {
      handleError(error); // Menangani error dengan error handler
      state.error = "Gagal menghapus user"; // Simpan pesan error di state
    }
  };

  const submitUser = () => {
    if (state.form.password !== state.form.password_confirmation) {
      state.error = "Password dan Konfirmasi Password tidak cocok";
      return;
    }
    if (state.isEditing) {
      updateUser();
    } else {
      addUser();
    }
  };

  const editUser = (user: any) => {
    state.form.username = user.username;
    state.form.email = user.email;
    state.form.role = user.role;
    state.selectedUserId = user.id;
    state.isEditing = true;
  };

  const resetForm = () => {
    state.form.username = "";
    state.form.email = "";
    state.form.password = "";
    state.form.password_confirmation = "";
    state.form.role = "staff";
    state.isEditing = false;
    state.selectedUserId = null;
  };

  return {
    state,
    loadUsers,
    submitUser,
    editUser,
    deleteUser,
  };
});
