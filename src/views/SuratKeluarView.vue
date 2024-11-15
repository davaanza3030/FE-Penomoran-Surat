<template>
  <div class="view-container flex-1 bg-white p-6 mx-4 mt-20 mb-6 rounded-xl shadow-md">
    <div class="max-w-6xl mx-auto mt-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-black">Daftar Surat Keluar</h1>
        <button @click="openFormModal"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none">
          Tambahkan Surat Keluar
        </button>
      </div>

      <!-- Input Search -->
      <div class="flex justify-end mb-4">
        <input v-model="searchQuery" type="text" placeholder="Cari surat keluar..."
          class="px-3 py-2 border border-gray-600 rounded w-1/3 bg-gray-100 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <!-- PrimeVue DataTable -->
      <DataTable :value="filteredAndSortedSuratKeluar" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        responsiveLayout="scroll" :filters="filters" sortField="date" :sortOrder="sortOrder" @sort="sortData"
        tableStyle="min-width: 50rem">

        <!-- Kolom lainnya -->
        <Column field="id" header="No" :sortable="true" />
        <Column field="date" header="Tanggal" :sortable="true" />
        <Column field="recipient" header="Tujuan" :sortable="true" />

        <!-- Kolom Kategori -->
        <Column header="Kategori">
          <template #body="slotProps">
            {{ getCategoryName(slotProps.data.category_id) }}
          </template>
        </Column>

        <Column field="letter_number" header="Nomor Surat" :sortable="true" />
        <Column header="Aksi">
          <template #body="slotProps">
            <div class="space-x-2">
              <Button @click="viewDetail(slotProps.data)" label="Detail" icon="pi pi-search" class="p-button-text" />
              <Button @click="deleteLetter(slotProps.data.id)" label="Hapus" icon="pi pi-trash"
                class="p-button-danger p-button-text" />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Modal Form Surat Keluar -->
      <div v-if="showFormModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg text-black">
          <h2 class="text-2xl font-bold mb-4">Form Surat Keluar</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="nomor_surat" class="block text-sm font-medium text-black">Nomor Surat:</label>
              <input v-model="form.letter_number" id="nomor_surat" type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black"
                placeholder="nomor surat akan tampil disini" />
            </div>
            <div>
              <label for="date" class="block text-sm font-medium text-black">Tanggal Surat:</label>
              <input v-model="form.date" id="date" type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
            </div>
            <div>
              <label for="recipient" class="block text-sm font-medium text-black">Tujuan/Penerima:</label>
              <input v-model="form.recipient" id="recipient" type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
            </div>
            <div>
              <label for="recipient_abbreviation" class="block text-sm font-medium text-black">Singkatan Instansi Tujuan:</label>
              <input v-model="form.recipient_abbreviation" id="recipient_abbreviation" type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black"
                placeholder="Masukkan singkatan instansi tujuan" />
            </div>
            <div>
              <label for="category" class="block text-sm font-medium text-black">Kategori Surat:</label>
              <select v-model="form.category_id" id="category"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black"
                :disabled="isLoadingCategories">
                <option v-if="isLoadingCategories" disabled>
                  Memuat kategori...
                </option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="subject" class="block text-sm font-medium text-black">Perihal:</label>
              <input v-model="form.subject" id="subject" type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black" />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-black">Deskripsi Surat:</label>
              <textarea v-model="form.description" id="description"
                class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-black"></textarea>
            </div>
            <div>
              <label for="attachments" class="block text-sm font-medium text-black">Lampiran:</label>
              <input @change="handleFileChange" id="attachments" type="file" class="mt-1 block w-full" />
            </div>
            <div class="flex space-x-2">
              <button type="submit"
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none">
                Tambahkan Surat Keluar
              </button>
              <button @click="showFormModal = false"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 focus:outline-none">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal untuk Detail Surat Keluar -->
      <div v-if="showDetailModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white w-full max-w-3xl p-6 shadow-lg border border-gray-600 rounded-lg text-black">
          <h2 class="text-xl font-bold mb-4">Detail Surat Keluar</h2>
          <div class="grid grid-cols-3 gap-x-2 gap-y-2 text-lg">
            <p class="font-semibold">Tanggal</p>
            <p  class="col-span-2">: {{ detailSurat?.date }}</p>
            <p class="font-semibold">Tujuan</p>
            <p class="col-span-2">: {{ detailSurat?.recipient }}</p>
            <p class="font-semibold">Kategori</p>
            <p class="col-span-2">: {{ getCategoryName(detailSurat?.category_id) }}</p>
            <p class="font-semibold">Perihal</p>
            <p class="col-span-2">: {{ detailSurat?.subject }}</p>
            <p class="font-semibold">Deskripsi</p>
            <p class="col-span-2">: {{ detailSurat?.description }}</p>
          </div>
          <div v-if="attachmentType === 'image'" class="mt-4">
            <img :src="attachmentUrl" alt="Attachment"
              class="w-full h-auto rounded-md border border-gray-600 shadow-sm" />
            <div class="mt-2 text-center">
              <a :href="attachmentDownloadUrl" download :title="attachmentName"
                class="text-blue-400 hover:text-blue-500 hover:underline">
                {{ attachmentName }}
              </a>
            </div>
          </div>
          <div v-if="attachmentType === 'document'" class="mt-4 text-center">
            <a :href="attachmentDownloadUrl" download :title="attachmentName"
              class="text-blue-400 hover:text-blue-500 hover:underline">
              {{ attachmentName }}
            </a>
          </div>
          <div class="flex justify-end mt-6">
            <button @click="closeModal"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors duration-200">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSuratKeluarStore } from "../stores/suratKeluarStore";
import { onMounted, computed, ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const showFormModal = ref(false);

// Definisikan ref untuk showFormModal
const openFormModal = () => {
  showFormModal.value = true;
  loadLastId(); // Pastikan ID terakhir dimuat sebelum form terbuka
};

const {
  form,
  suratKeluar,
  categories,
  loadCategories,
  loadSuratKeluar,
  submitSuratKeluar,
  handleFileChange,
  deleteSuratKeluar,
  loadLastId,
  isLoadingCategories,
  showDetailModal,
  detailSurat,
  attachmentUrl,
  attachmentDownloadUrl,
  attachmentType,
  attachmentName,
  getCategoryName,
  viewDetail,
  closeModal,
} = useSuratKeluarStore();

const searchQuery = ref("");
const sortedColumn = ref("");
const sortOrder = ref(1);
const filters = computed(() => ({
  global: { value: searchQuery.value, matchMode: "contains" }
}));

const filteredAndSortedSuratKeluar = computed(() => {
  return suratKeluar.value; // Modify this if you need more complex filtering
});


const sortData = (event: any) => {
    sortOrder.value = event.sortOrder;
};

onMounted(() => {
  loadCategories();
  loadSuratKeluar().then(() => {
    console.log("Loaded Surat Keluar:", suratKeluar.value);  // Cek surat keluar di console
  });
});

const submitForm = async () => {
  await submitSuratKeluar();
  showFormModal.value = false; // Tutup modal setelah form dikirim
};

const deleteLetter = async (id: number) => {
  if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
    await deleteSuratKeluar(id);
  }
};
</script>
