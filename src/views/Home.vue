<template>
  <div class="view-container flex-1 p-4 sm:p-6 mx-4 mt-20 mb-6 bg-gray-100 rounded-xl">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Penerima</h2>
        <DoughnutChart />
      </div>
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Kategori</h2>
        <BarChart />
      </div>
    </div>
    <div class="bg-white p-4 sm:p-6 mt-4 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Persuratan</h2>
      <LineChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import DoughnutChart from "../components/DoughnutChart.vue";
import LineChart from "../components/LineChart.vue";
import BarChart from "../components/BarChart.vue";
</script>
