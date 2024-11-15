import { defineStore } from "pinia";
import { reactive } from "vue";
import { apiService } from "../utility/apiService";
import handleError from "../utility/errorHandler"; // Menggunakan error handler

export const useNumberFormatStore = defineStore("numberFormatStore", () => {
  const state = reactive({
    formats: [],
    form: {
      format_string: "",
    },
    isEditing: false,
    selectedFormatId: null,
    loading: false,
    error: null,
  });

  // Load semua format number dari API
  const loadFormats = async () => {
    state.loading = true;
    state.error = null;
    try {
      const response = await apiService.apiGet("/number-formats");
      state.formats = response.data; // Menyimpan data format
    } catch (error) {
      handleError(error);
      state.error = "Gagal memuat format"; // Menyimpan pesan error di state
    } finally {
      state.loading = false;
    }
  };

  // Tambahkan format number baru
  const addFormat = async () => {
    state.loading = true;
    try {
      await apiService.apiPost("/number-formats", state.form);
      await loadFormats(); // Memuat ulang format setelah menambah
      resetForm();
    } catch (error) {
      handleError(error);
      state.error = "Gagal menambah format";
    } finally {
      state.loading = false;
    }
  };

  // Update format number
  const updateFormat = async () => {
    state.loading = true;
    try {
      await apiService.apiPut(
        `/number-formats/${state.selectedFormatId}`,
        state.form
      );
      await loadFormats(); // Memuat ulang format setelah memperbarui
      resetForm();
    } catch (error) {
      handleError(error);
      state.error = "Gagal memperbarui format";
    } finally {
      state.loading = false;
    }
  };

  // Hapus format number
  const deleteFormat = async (id: number) => {
    state.loading = true;
    try {
      await apiService.apiDelete(`/number-formats/${id}`);
      await loadFormats(); // Memuat ulang format setelah menghapus
    } catch (error) {
      handleError(error);
      state.error = "Gagal menghapus format";
    } finally {
      state.loading = false;
    }
  };

  // Submit format berdasarkan apakah sedang mengedit atau menambah baru
  const submitFormat = () => {
    if (state.isEditing) {
      updateFormat();
    } else {
      addFormat();
    }
  };

  // Fungsi untuk mulai mengedit format
  const editFormat = (format: any) => {
    state.form.format_string = format.format_string;
    state.selectedFormatId = format.id;
    state.isEditing = true;
  };

  // Reset form dan state
  const resetForm = () => {
    state.form.format_string = "";
    state.isEditing = false;
    state.selectedFormatId = null;
  };

  return {
    state,
    loadFormats,
    submitFormat,
    editFormat,
    deleteFormat,
    resetForm,
  };
});
