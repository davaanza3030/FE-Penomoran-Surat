import { ref, type Ref, watch, onMounted } from "vue";
import { apiService } from "../utility/apiService";
import { ElNotification } from 'element-plus';

interface Category {
  id: number;
  name: string;
}

export const useSuratKeluarStore = () => {
  const form = ref({
    date: "" as string,
    recipient: "" as string,
    recipient_abbreviation: "" as string,
    category_id: null as number | null,
    subject: "" as string,
    description: "" as string,
    letter_number: "" as string,
    attachments: null as File | null,
  });

  const suratKeluar = ref([]);
  const categories: Ref<Category[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isLoadingCategories = ref(true);
  const showDetailModal = ref(false);
  const attachmentUrl = ref("");
  const attachmentDownloadUrl = ref("");
  const attachmentType = ref("");
  const attachmentName = ref("");
  const lastId = ref(0);

  const detailSurat = ref<{ 
    date: string; 
    recipient: string; 
    category_id: number | null; 
    subject: string; 
    description: string; 
} | null>(null);

  const loadLastId = async () => {
    try {
      const response = await apiService.apiGet('/outgoing-letters/last-id');
      lastId.value = response.data.last_id + 1; // Tambahkan 1 untuk nomor urut baru
      generateNomorSurat(); // Panggil fungsi generate pertama kali setelah mendapatkan lastId
    } catch (error) {
      console.error('Gagal memuat ID terakhir:', error);
    }
  };

  const convertToRoman = (month: number) => {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romans[month - 1];
  };

  const getCategoryAbbreviation = (categoryId: number): string => {
    const abbreviations: { [key: string]: string } = {
      1: 'SK',
      2: 'SU',
      3: 'SPm',
      4: 'SPb',
      5: 'SPp',
      6: 'SPn',
      7: 'SM',
      8: 'ST',
      9: 'SKet',
      10: 'SR',
      11: 'SB',
      12: 'SPPD',
      13: 'SRT',
      14: 'PK',
      15: 'SPeng'
    };
    return abbreviations[categoryId.toString()] || 'Unknown';
  };

  const generateNomorSurat = () => {
    if (form.value.date && form.value.category_id && form.value.recipient_abbreviation) {
      const year = new Date(form.value.date).getFullYear();
      const monthRoman = convertToRoman(new Date(form.value.date).getMonth() + 1);
      const categoryAbbreviation = getCategoryAbbreviation(form.value.category_id);
      const categoryCode = form.value.category_id.toString().padStart(2, "0");
      const formattedNumber = lastId.value.toString().padStart(3, "0");

      form.value.letter_number = `${categoryCode}.${formattedNumber}/${categoryAbbreviation}/${form.value.recipient_abbreviation}/${monthRoman}/${year}`;
    }
  };

  watch(() => form.value.date, generateNomorSurat);
  watch(() => form.value.category_id, generateNomorSurat);
  watch(() => form.value.recipient_abbreviation, generateNomorSurat);

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
      console.log("Categories loaded:", categories.value);  // Tambahkan ini
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    } finally {
      isLoadingCategories.value = false;
    }
  };

  const loadSuratKeluar = async () => {
    loading.value = true;
    try {
      const response = await apiService.apiGet("/outgoing-letters");
      suratKeluar.value = response.data;
    } catch (err) {
      error.value = "Gagal memuat surat keluar";
    } finally {
      loading.value = false;
    }
  };

  const submitSuratKeluar = async () => {
    const formData = new FormData();
    formData.append("date", form.value.date);
    formData.append("recipient", form.value.recipient);
    formData.append("recipient_abbreviation", form.value.recipient_abbreviation);
    formData.append("category_id", String(form.value.category_id));
    formData.append("subject", form.value.subject);
    formData.append("description", form.value.description);
    formData.append("letter_number", form.value.letter_number);

    if (form.value.attachments) {
      formData.append("attachments", form.value.attachments);
    }

    try {
      await apiService.apiPost("/outgoing-letters", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      loadSuratKeluar();
      resetForm();
      ElNotification.success({
        title: 'Berhasil',
        message: 'Nomor surat berhasil ditambahkan!',
        offset: 100
      });
    } catch (err) {
      error.value = "Gagal menambah surat keluar";
    }
  };

  const deleteSuratKeluar = async (id: number) => {
    try {
      await apiService.apiDelete(`/outgoing-letters/${id}`, null);
      loadSuratKeluar();
    } catch (err) {
      error.value = "Gagal menghapus surat keluar";
    }
  };

  const resetForm = () => {
    form.value.date = "";
    form.value.recipient = "";
    form.value.category_id = null;
    form.value.subject = "";
    form.value.description = "";
    form.value.letter_number = "";
    form.value.attachments = null;

    const fileInput = document.getElementById("attachments") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const getCategoryName = (categoryId: number | null | undefined) => { 
  if (categoryId === null || categoryId === undefined) return 'Tidak ditemukan';
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : 'Tidak ditemukan';
};

  

  const viewDetail = async (letter: any) => {
    try {
      const response = await apiService.apiGet(`/outgoing-letters/${letter.id}`);
      detailSurat.value = response.data.letter || null;
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

//   onMounted(() => {
//     loadCategories();
//     loadSuratKeluar().then(() => {
//         console.log("Loaded Surat Keluar:", suratKeluar.value);  // Cek surat keluar di console
//     });
// });

  return {
    form,
    suratKeluar,
    categories,
    loading,
    error,
    isLoadingCategories,
    loadLastId,
    loadCategories,
    loadSuratKeluar,
    submitSuratKeluar,
    deleteSuratKeluar,
    handleFileChange,
    resetForm,
    getCategoryName,
    viewDetail,
    showDetailModal,
    detailSurat,
    attachmentUrl,
    attachmentDownloadUrl,
    attachmentType,
    attachmentName,
    closeModal,
  };
};
