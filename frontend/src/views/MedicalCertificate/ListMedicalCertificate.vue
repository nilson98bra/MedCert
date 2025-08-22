<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import { getEmployees } from "@/services/employee-service";
import { getMedicalCertificates } from "@/services/medcertificate-service";
import Employee from "@/enums/Employee";
import MedCertificate from "@/enums/MedCertificate";

const collaborators = ref<Employee[]>([]);
const medcertificates = ref<MedCertificate[]>([]);

const totalPages = ref(1);
const totalItems = ref(0);
const currentPage = ref(1);

const router = useRouter();

// Filtros
const filterCollaborator = ref("");
const startDate = ref("");
const endDate = ref("");
const filterCid = ref("");
const sortOrder = ref<"asc" | "desc">("desc");

const itemsPerPage = 5;

const fetchMedicalCertificates = async () => {
  try {
    const params = {
      employeeName: filterCollaborator.value || undefined,
      cid: filterCid.value || undefined,
      dateTimeInit: startDate.value || undefined,
      dateTimeEnd: endDate.value || undefined,
      page: currentPage.value,
      limit: itemsPerPage,
    };

    const response = await getMedicalCertificates(params);

    medcertificates.value = Array.isArray(response.data) ? response.data : [];

    // Ajusta paginação
    totalPages.value = Number(response.totalPages) || 1;
    totalItems.value = Number(response.totalItems) || 0;
    currentPage.value = Number(response.currentPage) || 1;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  collaborators.value = await getEmployees({ page: 1, limit: 50 });
  await fetchMedicalCertificates();
});

// Atualiza dados quando filtros ou paginação mudam
watch(
  [filterCollaborator, filterCid, startDate, endDate, sortOrder, currentPage],
  async () => {
    await fetchMedicalCertificates();
  },
);

// Navegação de páginas
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Alterna ordem de sort
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

const createAtestado = () => router.push("/atestados/cadastrar");
</script>

<template>
  <div class="p-4">
    <!-- Cabeçalho -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3"
    >
      <h2 class="text-xl font-semibold">Atestados Registrados</h2>
      <Button
        label="Registrar Atestado"
        @click="createAtestado"
        class="w-full sm:w-auto"
      />
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h3 class="font-medium mb-2">Filtros</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium text-gray-700"
            >Colaborador</label
          >
          <select
            v-model="filterCollaborator"
            class="p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Todos</option>
            <option v-for="c in collaborators" :key="c.id" :value="c.name">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium text-gray-700"
            >Data Início</label
          >
          <input
            v-model="startDate"
            type="date"
            class="p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium text-gray-700">Data Fim</label>
          <input
            v-model="endDate"
            type="date"
            class="p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium text-gray-700">CID</label>
          <input
            v-model="filterCid"
            type="text"
            placeholder="Ex: J00"
            class="p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <Button
          :label="
            sortOrder === 'desc'
              ? 'Ordenar (Mais Recente)'
              : 'Ordenar (Mais Antigo)'
          "
          @click="toggleSortOrder"
          class="bg-gray-200 text-gray-800 hover:bg-gray-300"
        />
      </div>
    </div>

    <!-- Tabela Desktop -->
    <div
      class="hidden md:block overflow-x-auto bg-white rounded-lg shadow border border-gray-200"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Colaborador
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Data
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Dias de Afastamento
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              CID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Observações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="certificate in medcertificates" :key="certificate.id">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ certificate.employeeName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ certificate.medicalCertificateDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ certificate.daysAway }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ certificate.cid }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ certificate.observation }}
            </td>
          </tr>
          <tr v-if="medcertificates.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              Nenhum atestado encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Lista Mobile -->
    <div class="md:hidden space-y-4">
      <div
        v-for="certificate in medcertificates"
        :key="certificate.id"
        class="bg-white p-4 rounded-lg shadow border border-gray-200"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium text-gray-900">
            {{ certificate.employeeName }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ certificate.medicalCertificateDate }}
          </p>
        </div>
        <p class="text-sm text-gray-600 mb-1">
          <span class="font-medium">CID:</span> {{ certificate.cid }}
        </p>
        <p class="text-sm text-gray-600 mb-1">
          <span class="font-medium">Dias:</span> {{ certificate.daysAway }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-medium">Obs:</span> {{ certificate.observation }}
        </p>
      </div>
      <div
        v-if="medcertificates.length === 0"
        class="bg-white p-4 rounded-lg shadow border border-gray-200 text-center text-gray-500"
      >
        Nenhum atestado encontrado.
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex justify-center items-center mt-6 space-x-2">
      <Button
        label="Anterior"
        @click="prevPage"
        :disabled="currentPage === 1"
        class="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
      />
      <span class="text-gray-700"
        >Página {{ currentPage }} de {{ totalPages }}</span
      >
      <Button
        label="Próxima"
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
      />
    </div>
  </div>
</template>
