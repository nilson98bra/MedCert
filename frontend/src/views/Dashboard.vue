<script setup lang="ts">
import { getEmployees } from "@/services/employee-service";
import { getMedicalCertificates } from "@/services/medcertificate-service";
import { onMounted, ref } from "vue";

const totalNumberEmployees = ref<number>(0);
const activeNumberEmployees = ref<number>(0);
const totalMedicalCertificates = ref<number>(0);

onMounted(async () => {
  try {
    Promise.all([]);
    const [employees, medicalCertificates] = await Promise.all([
      getEmployees(),
      getMedicalCertificates(),
    ]);

    totalNumberEmployees.value = employees.length || 0;
    activeNumberEmployees.value =
      employees.filter((x) => x.status == "active").length || 0;
    totalMedicalCertificates.value = medicalCertificates.data.length || 0;
  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
  }
});
</script>

<template>
  <div class="px-4 py-8 md:p-4">
    <h2 class="text-xl font-semibold mb-10">Dashboard</h2>
    <div
      class="flex flex-col items-center gap-y-3 md:flex-row md:justify-center md:gap-x-2"
    >
      <div
        class="w-52 md:h-52 md:w-64 rounded-md border border-blue-600 p-4 flex flex-col items-center justify-between"
      >
        <div class="flex flex-col items-center">
          <img
            src="@/assets/imgs/employee.png"
            alt="Icone de colaboradores"
            class="w-10 mb-4 mx-auto"
          />
          <span class="font-bold text-gray-500">Colaboradores Totais</span>
        </div>
        <span class="text-5xl text-gray-500">{{ totalNumberEmployees }}</span>
      </div>
      <div
        class="w-52 md:h-52 md:w-64 rounded-md border border-blue-600 p-4 flex flex-col items-center justify-between"
      >
        <div class="flex flex-col items-center">
          <img
            src="@/assets/imgs/employee.png"
            alt="Icone de colaboradores"
            class="w-10 mb-4 mx-auto"
          />
          <span class="font-bold text-gray-500">Colaboradores Ativos</span>
        </div>
        <span class="text-5xl text-gray-500">{{ activeNumberEmployees }}</span>
      </div>
      <div
        class="w-52 md:h-52 md:w-64 rounded-md border border-blue-600 p-4 flex flex-col items-center justify-between"
      >
        <div class="flex flex-col items-center">
          <img
            src="@/assets/imgs/medical-certificate.png"
            alt="Icone de atestados"
            class="w-10 mb-4 mx-auto"
          />
          <span class="font-bold text-gray-500">Atestados</span>
        </div>
        <span class="text-5xl text-gray-500">{{
          totalMedicalCertificates
        }}</span>
      </div>
    </div>
  </div>
</template>

<style></style>
