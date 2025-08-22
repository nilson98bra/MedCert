<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import {
  changeEmployeeStatus,
  getEmployees,
} from "@/services/employee-service";

interface Employee {
  id: string;
  name: string;
  cpf: string;
  birthdayDate: Date;
  role: string;
  status: "active" | "inactive";
}

const employees = ref<Employee[]>([]);
const isLoading = ref(false);

const router = useRouter();
const searchTerm = ref("");
const filterStatus = ref("");

const handleToggleChange = async (employee: Employee) => {
  const newStatus = employee.status === "active" ? "inactive" : "active";
  employee.status = newStatus;
  await changeEmployeeStatus(employee.id, newStatus);
};

const filteredEmployees = computed(() => {
  let filtered = employees.value;

  if (filterStatus.value === "active") {
    filtered = filtered.filter((employee) => employee.status === "active");
  } else if (filterStatus.value === "inactive") {
    filtered = filtered.filter((employee) => employee.status === "inactive");
  }

  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchLower) ||
        employee.role.toLowerCase().includes(searchLower) ||
        employee.cpf.toLowerCase().includes(searchLower),
    );
  }

  return filtered;
});

const createEmployee = () => router.push("/colaboradores/cadastrar");

onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await getEmployees({ page: 1, limit: 50 });
    employees.value = data || [];
  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>

<template>
  <div class="px-4 py-8 md:p-4">
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3"
    >
      <h2 class="text-xl font-semibold">Tabela de Colaboradores</h2>
      <Button
        label="Cadastrar Colaborador"
        @click="createEmployee"
        class="w-full sm:w-auto"
      />
    </div>

    <div class="flex flex-col sm:flex-row sm:space-x-4 mb-4 gap-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar por nome, cargo ou cpf..."
        class="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      <select
        v-model="filterStatus"
        class="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:w-40"
      >
        <option value="">Todos</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
    </div>

    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Data de Nascimento
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              CPF
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nome
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Cargo
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(employee.birthdayDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ employee.cpf }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ employee.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <label
                :for="'toggle-status-' + employee.id"
                class="flex items-center cursor-pointer relative"
              >
                <input
                  :id="'toggle-status-' + employee.id"
                  type="checkbox"
                  class="sr-only"
                  :checked="employee.status === 'active'"
                  @change="() => handleToggleChange(employee)"
                />
                <div
                  class="block w-14 h-8 rounded-full transition-colors duration-300"
                  :class="
                    employee.status === 'active' ? 'bg-blue-600' : 'bg-gray-400'
                  "
                ></div>
                <div
                  class="dot absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300"
                  :class="{ 'translate-x-6': employee.status === 'active' }"
                ></div>
              </label>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              Nenhum colaborador encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-4">
      <div
        v-for="employee in filteredEmployees"
        :key="employee.id"
        class="bg-white p-4 rounded-lg shadow border border-gray-200 relative"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-medium text-gray-900">{{ employee.name }}</h3>
            <p class="text-sm text-gray-500">{{ employee.id }}</p>
          </div>
          <label
            :for="'mobile-toggle-' + employee.id"
            class="flex items-center cursor-pointer relative"
          >
            <input
              :id="'mobile-toggle-' + employee.id"
              type="checkbox"
              class="sr-only"
              :checked="employee.status === 'active'"
              @change="() => handleToggleChange(employee)"
            />
            <div
              class="block w-14 h-8 rounded-full transition-colors duration-300"
              :class="
                employee.status === 'active' ? 'bg-blue-600' : 'bg-gray-400'
              "
            ></div>
            <div
              class="dot absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300"
              :class="{ 'translate-x-6': employee.status === 'active' }"
            ></div>
          </label>
        </div>
        <p class="text-sm text-gray-600 mb-2">
          <span class="font-medium">Cargo:</span> {{ employee.role }}
        </p>
        <p class="text-sm">
          <span class="font-medium">Status:</span>
          <span
            :class="
              employee.status === 'active' ? 'text-green-600' : 'text-red-600'
            "
          >
            {{ employee.status === "active" ? "Ativo" : "Inativo" }}
          </span>
        </p>
      </div>
      <div
        v-if="filteredEmployees.length === 0"
        class="bg-white p-4 rounded-lg shadow border border-gray-200 text-center text-gray-500"
      >
        Nenhum colaborador encontrado.
      </div>
    </div>
  </div>
</template>

<style scoped>
.dot {
  transition: transform 0.3s ease-in-out;
}
</style>
