<template>
  <div class="card flex justify-center">
    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { apiService } from "../utility/apiService";

const chartData = ref();
const chartOptions = ref(null);

onMounted(async () => {
  const processedData = await processData(); // Memproses data pengirim
  chartData.value = setChartData(processedData); // Set chart data dengan pengirim dan "Lainnya"
  chartOptions.value = setChartOptions();
});

// Fungsi untuk memproses data surat masuk dan menghitung pengirim terbanyak
const processData = async () => {
  try {
    const responseMasuk = await apiService.apiGet("/incoming-letters");

    // Hitung jumlah surat masuk berdasarkan pengirim
    const pengirimCount = {}; // Objek untuk menyimpan jumlah surat per pengirim

    responseMasuk.data.forEach((surat) => {
      const pengirim = surat.sender; // Ambil pengirim
      if (pengirimCount[pengirim]) {
        pengirimCount[pengirim]++;
      } else {
        pengirimCount[pengirim] = 1;
      }
    });

    // Urutkan pengirim berdasarkan jumlah surat, dari yang terbanyak ke yang paling sedikit
    const sortedPengirim = Object.entries(pengirimCount).sort((a, b) => b[1] - a[1]);

    // Ambil dua pengirim terbanyak
    const topPengirim = sortedPengirim.slice(0, 2);
    let othersCount = 0;

    // Gabungkan sisa pengirim ke dalam kategori "Lainnya"
    sortedPengirim.slice(2).forEach(([pengirim, count]) => {
      othersCount += count;
    });

    // Siapkan labels dan data untuk chart
    const finalLabels = topPengirim.map(([pengirim]) => pengirim);
    const finalData = topPengirim.map(([, count]) => count);

    // Tambahkan kategori "Lainnya" jika ada
    if (othersCount > 0) {
      finalLabels.push("Lainnya");
      finalData.push(othersCount);
    }

    return { labels: finalLabels, data: finalData };
  } catch (error) {
    console.error("Error fetching surat masuk:", error);
    return { labels: [], data: [] }; // Jika error, kembalikan data kosong
  }
};

// Fungsi untuk set data chart
const setChartData = (processedData) => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: processedData.labels, // Labels dari pengirim dan "Lainnya"
    datasets: [
      {
        data: processedData.data, // Data jumlah surat per pengirim
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
          documentStyle.getPropertyValue('--p-blue-500'), // Warna untuk kategori "Lainnya"
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400'),
          documentStyle.getPropertyValue('--p-blue-400'),
        ]
      }
    ]
  };
};

// Fungsi untuk set chart options
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor
        }
      }
    }
  };
};
</script>

<style scoped>
/* Anda bisa menambahkan styling opsional jika diperlukan */
</style>
