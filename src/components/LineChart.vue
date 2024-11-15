<template>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "../utility/apiService"; // Panggil apiService untuk menggunakan API nyata

// Data untuk Chart.js
const chartData = ref({
  labels: [] as string[], // Placeholder untuk label bulan
  datasets: [
    {
      label: "Surat Masuk",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      fill: false, // Supaya tidak ada warna di bawah garis
      data: [] as number[], // Placeholder untuk data surat masuk
    },
    {
      label: "Surat Keluar",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: false, // Supaya tidak ada warna di bawah garis
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
        color: "#000000" // Mengatur warna teks pada legenda menjadi hitam
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: "#000000", // Mengubah warna label pada sumbu X menjadi hitam
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)", // Warna grid abu-abu tipis pada sumbu X
        lineWidth: 0.5 // Menipiskan garis grid
      }
    },
    y: {
      ticks: {
        color: "#000000", // Mengubah warna label pada sumbu Y menjadi hitam
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)", // Warna grid abu-abu tipis pada sumbu Y
        lineWidth: 0.5 // Menipiskan garis grid
      }
    }
  },
  elements: {
    line: {
      tension: 0.4 // Mengatur kelengkungan garis agar lebih smooth
    }
  }
});

const loaded = ref(false);

// Fungsi untuk memuat data chart
const loadChartData = async () => {
  try {
    // Panggil API untuk mendapatkan data surat masuk dan keluar
    const responseMasuk = await apiService.apiGet("/incoming-letters");
    const responseKeluar = await apiService.apiGet("/outgoing-letters");

    // Inisialisasi array untuk surat masuk dan keluar per bulan
    const suratMasukPerBulan = new Array(12).fill(0) as number[];
    const suratKeluarPerBulan = new Array(12).fill(0) as number[];

    // Iterasi data surat masuk untuk menghitung jumlah per bulan
    responseMasuk.data.forEach((surat: { date: string }) => {
      const month = new Date(surat.date).getMonth(); // Ambil bulan dari tanggal
      suratMasukPerBulan[month]++; // Tambahkan surat masuk ke bulan tersebut
    });

    // Iterasi data surat keluar untuk menghitung jumlah per bulan
    responseKeluar.data.forEach((surat: { date: string }) => {
      const month = new Date(surat.date).getMonth(); // Ambil bulan dari tanggal
      suratKeluarPerBulan[month]++; // Tambahkan surat keluar ke bulan tersebut
    });

    // Tetapkan label bulan ke chart
    chartData.value.labels = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    // Masukkan data surat masuk dan keluar ke chart
    chartData.value.datasets[0].data = suratMasukPerBulan;
    chartData.value.datasets[1].data = suratKeluarPerBulan;

    loaded.value = true; // Tandai bahwa data sudah diload
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
};

onMounted(() => {
  loadChartData();
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 400px;
  background-color: #1e3a8a; /* Biru */
  padding: 20px;
  border-radius: 10px;
}
</style>
