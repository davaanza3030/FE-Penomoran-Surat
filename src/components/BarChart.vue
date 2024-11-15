<template>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "../utility/apiService";

// Data untuk Chart.js
const chartData = ref({
  labels: [] as string[], // Placeholder untuk label kategori
  datasets: [
    {
      label: "Surat Masuk",
      backgroundColor: "#36A2EB", // Ganti dengan warna biru yang sesuai
      borderColor: "#36A2EB",
      borderWidth: 1,
      data: [] as number[], // Placeholder untuk data surat masuk
    },
    {
      label: "Surat Keluar",
      backgroundColor: "#808080", // Ganti dengan warna abu-abu yang sesuai
      borderColor: "#808080",
      borderWidth: 1,
      data: [] as number[], // Placeholder untuk data surat keluar
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#000000", // Ubah warna teks legenda menjadi hitam
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: "#000000", // Ubah warna teks pada sumbu X menjadi hitam
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)", // Menipiskan warna grid menjadi abu-abu terang
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        color: "#000000", // Ubah warna teks pada sumbu Y menjadi hitam
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)", // Menipiskan warna grid menjadi abu-abu terang
      },
    },
  },
});

const loaded = ref(false);

// Fungsi untuk memuat data chart
const loadChartData = async () => {
  try {
    // Panggil API untuk mendapatkan data kategori, surat masuk, dan surat keluar
    const responseCategories = await apiService.apiGet("/categories");
    const responseMasuk = await apiService.apiGet("/incoming-letters");
    const responseKeluar = await apiService.apiGet("/outgoing-letters");

    // Inisialisasi array untuk menghitung jumlah surat masuk dan keluar per kategori
    const suratMasukPerKategori = {} as Record<string, number>;
    const suratKeluarPerKategori = {} as Record<string, number>;

    // Isi array dengan kategori dari API
    responseCategories.data.forEach((category: { id: number; name: string }) => {
      suratMasukPerKategori[category.name] = 0;
      suratKeluarPerKategori[category.name] = 0;
    });

    // Iterasi data surat masuk dan hitung jumlah per kategori
    responseMasuk.data.forEach((surat: { category_id: number }) => {
      const category = responseCategories.data.find((cat: { id: number }) => cat.id === surat.category_id);
      if (category) suratMasukPerKategori[category.name]++;
    });

    // Iterasi data surat keluar dan hitung jumlah per kategori
    responseKeluar.data.forEach((surat: { category_id: number }) => {
      const category = responseCategories.data.find((cat: { id: number }) => cat.id === surat.category_id);
      if (category) suratKeluarPerKategori[category.name]++;
    });

    // Tetapkan label kategori ke chart
    chartData.value.labels = responseCategories.data.map((category: { name: string }) => category.name);

    // Masukkan data surat masuk dan keluar ke chart (Stacked bar)
    chartData.value.datasets[0].data = Object.values(suratMasukPerKategori);
    chartData.value.datasets[1].data = Object.values(suratKeluarPerKategori);

    loaded.value = true; // Tandai bahwa data sudah diload
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
};

// Jalankan fungsi load data saat component di-mount
onMounted(() => {
  loadChartData();
});
</script>

<style scoped>
.card {
  width: 100%;
  height: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #1e3a8a;
}
</style>
