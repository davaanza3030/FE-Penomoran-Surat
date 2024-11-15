import { defineStore } from "pinia";
import { reactive } from "vue";
import { apiService } from "../utility/apiService";
import handleError from "../utility/errorHandler";

export const useCategoryStore = defineStore("categoryStore", () => {
  const state = reactive({
    categories: [] as Array<any>,
    form: {
      name: "",
    },
    isEditing: false,
    selectedCategoryId: null,
    loading: false,
    error: null as string | null,
  });

  const loadCategories = async () => {
    state.loading = true;
    state.error = null;
    try {
      const response = await apiService.apiGet("/categories");
      state.categories = response.data;
    } catch (error) {
      handleError(error);
      state.error = "Gagal memuat kategori";
    } finally {
      state.loading = false;
    }
  };

  const addCategory = async () => {
    try {
      await apiService.apiPost("/categories", state.form);
      await loadCategories();
      resetForm();
    } catch (error) {
      handleError(error);
      state.error = "Gagal menambah kategori";
    }
  };

  const updateCategory = async () => {
    try {
      await apiService.apiPut(`/categories/${state.selectedCategoryId}`, state.form);
      await loadCategories();
      resetForm();
    } catch (error) {
      handleError(error);
      state.error = "Gagal memperbarui kategori";
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await apiService.apiDelete(`/categories/${id}`, null);
      await loadCategories();
    } catch (error) {
      handleError(error);
      state.error = "Gagal menghapus kategori";
    }
  };

  const submitCategory = () => {
    if (state.isEditing) {
      updateCategory();
    } else {
      addCategory();
    }
  };

  const editCategory = (category: any) => {
    state.form.name = category.name;
    state.selectedCategoryId = category.id;
    state.isEditing = true;
  };

  const resetForm = () => {
    state.form.name = "";
    state.isEditing = false;
    state.selectedCategoryId = null;
  };

  return {
    state,
    loadCategories,
    submitCategory,
    editCategory,
    deleteCategory,
    resetForm,
  };
});
