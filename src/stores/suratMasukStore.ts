import { ref, type Ref } from "vue";
import { apiService } from "../utility/apiService";
import { ElNotification } from 'element-plus';

interface Category {
  id: number;
  name: string;
}

interface SuratMasuk {
  date: string;
  sender: string;
  category_id: number | null;
  subject: string;
  description: string;
  attachments: File | null;
  letter_number: string;
}

interface Letter {
  id: number;
}

export const useSuratMasukStore = () => {
  const form: Ref<SuratMasuk> = ref({
    date: "",
    sender: "",
    category_id: null,
    subject: "",
    description: "",
    attachments: null,
    letter_number: "",
  });

  const suratMasuk = ref([]);
  const categories: Ref<Category[]> = ref([]);
  const loading = ref(false);
  const error = ref("");
  const isLoadingCategories = ref(true);
  const attachmentDownloadUrl = ref("");
  const showDetailModal = ref(false);
  const detailSurat: Ref<SuratMasuk | null> = ref(null);
  const attachmentUrl = ref("");
  const attachmentType = ref("");
  const attachmentName = ref("");

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      form.value.attachments = target.files[0];
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.apiGet("/categories");
      categories.value = response.data;
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    } finally {
      isLoadingCategories.value = false;
    }
  };

  const loadSuratMasuk = async () => {
    loading.value = true;
    try {
      const response = await apiService.apiGet("/incoming-letters");
      suratMasuk.value = response.data;
    } catch (err) {
      error.value = "Gagal memuat surat masuk";
    } finally {
      loading.value = false;
    }
  };

  const submitSuratMasuk = async () => {
    const formData = new FormData();
    formData.append("date", form.value.date);
    formData.append("sender", form.value.sender);
    formData.append("category_id", String(form.value.category_id));
    formData.append("subject", form.value.subject);
    formData.append("description", form.value.description);
    formData.append("letter_number", form.value.letter_number);

    if (form.value.attachments) {
      formData.append("attachments", form.value.attachments);
    }

    try {
      await apiService.apiPost("/incoming-letters", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      loadSuratMasuk();
      resetForm();
      ElNotification.success({
        title: 'Berhasil',
        message: 'Nomor surat berhasil ditambahkan!',
        offset: 100
      });
    } catch (err) {
      error.value = "Gagal menambah surat masuk";
    }
  };

  const deleteSuratMasuk = async (id: number) => {
    try {
      await apiService.apiDelete(`/incoming-letters/${id}`, null);
      loadSuratMasuk();
    } catch (err) {
      error.value = "Gagal menghapus surat masuk";
    }
  };

  const resetForm = () => {
    form.value.date = "";
    form.value.sender = "";
    form.value.category_id = null;
    form.value.subject = "";
    form.value.description = "";
    form.value.attachments = null;
    form.value.letter_number = "";

    const fileInput = document.getElementById(
      "attachments"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const getCategoryName = (categoryId: number | null | undefined) => {
    if (categoryId === null || categoryId === undefined) return 'Tidak ditemukan';
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak ditemukan';
};

  const viewDetail = async (letter: Letter) => {
    try {
      const response = await apiService.apiGet(`/incoming-letters/${letter.id}`);
      detailSurat.value = response.data.letter;
      attachmentName.value = response.data.attachmentName;
      attachmentUrl.value = response.data.attachmentUrl;
      attachmentDownloadUrl.value = response.data.attachmentDownloadUrl;

      if (response.data.fileType === "image") {
        attachmentType.value = "image";
      } else if (response.data.fileType === "document") {
        attachmentType.value = "document";
      }

      showDetailModal.value = true;
    } catch (error) {
      console.error("Gagal memuat detail surat:", error);
    }
  };

  const closeModal = () => {
    showDetailModal.value = false;
    detailSurat.value = null;
    attachmentUrl.value = "";
    attachmentType.value = "";
  };

  return {
    form,
    suratMasuk,
    categories,
    loading,
    error,
    showDetailModal,
    detailSurat,
    attachmentUrl,
    attachmentDownloadUrl,
    attachmentType,
    attachmentName,
    isLoadingCategories,
    loadCategories,
    loadSuratMasuk,
    submitSuratMasuk,
    deleteSuratMasuk,
    handleFileChange,
    resetForm,
    getCategoryName,
    viewDetail,
    closeModal,
  };
};
