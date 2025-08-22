<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4"
  >
    <h1 class="text-6xl font-bold text-blue-600 mb-4">404</h1>
    <p class="text-xl mb-6">Essa página não existe</p>
    <button
      @click="goHome"
      class="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-800 transition"
    >
      Voltar para a Home
    </button>
  </div>
</template>

<style scoped></style>
