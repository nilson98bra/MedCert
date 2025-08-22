<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { z, ZodError } from "zod";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import { errorMessage, successMessage } from "@/utils/alerts";
import Employee from "@/enums/Employee";
import { getEmployees } from "@/services/employee-service";
import {
  createMedicalCertificates,
  getCIDs,
} from "@/services/medcertificate-service";

const router = useRouter();

const collaborators = ref<Employee[]>([]);
onMounted(async () => {
  try {
    const data = await getEmployees({ page: 1, limit: 50 });
    collaborators.value = data;
  } catch (err) {
    console.error(err);
  }
});

const employeeId = ref("");
const employeeName = ref("");
const medicalCertificateDate = ref("");
const daysAway = ref("");
const cidInput = ref("");
const cidDescription = ref("");
const notes = ref("");

const cidOptions = ref<{ cid: string; description: string }[]>([]);
const showCidOptions = ref(false);
const loadingCid = ref(false);

watch(cidInput, async (newValue) => {
  if (!newValue || newValue.length < 2) {
    cidOptions.value = [];
    showCidOptions.value = false;
    loadingCid.value = false;
    return;
  }
  loadingCid.value = true;
  try {
    const results = await getCIDs(newValue);
    cidOptions.value = results;
    showCidOptions.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    loadingCid.value = false;
  }
});

const selectCid = (option: { cid: string; description: string }) => {
  cidInput.value = option.cid;
  cidDescription.value = option.description;
  showCidOptions.value = false;
};

const errors = ref({
  employeeId: "",
  medicalCertificateDate: "",
  daysAway: "",
  cid: "",
});

const medicalCertificateSchema = z.object({
  employeeId: z
    .string()
    .min(1, { message: "Seleção do colaborador é obrigatória." }),
  medicalCertificateDate: z
    .string()
    .min(1, { message: "Data e hora do atestado são obrigatórias." })
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
      message: "Formato deve ser YYYY-MM-DDTHH:mm",
    }),
  daysAway: z.coerce
    .number()
    .min(1, { message: "Deve ser no mínimo 1 dia." })
    .max(365, { message: "Máximo de 365 dias." }),
  cid: z.string().min(1, { message: "CID é obrigatório." }),
  notes: z.string().optional(),
});

const validateField = (field: keyof typeof errors.value, value: any) => {
  try {
    medicalCertificateSchema.shape[field].parse(value);
    errors.value[field] = "";
  } catch (err: any) {
    if (err instanceof ZodError) {
      errors.value[field] = err.issues[0].message;
    }
  }
};

watch(employeeId, (newValue) => validateField("employeeId", newValue));
watch(medicalCertificateDate, (newValue) =>
  validateField("medicalCertificateDate", newValue),
);
watch(daysAway, (newValue) => validateField("daysAway", newValue));
watch(cidInput, (newValue) => validateField("cid", newValue));

const handleRegister = async () => {
  errors.value = {
    employeeId: "",
    medicalCertificateDate: "",
    daysAway: "",
    cid: "",
  };

  try {
    medicalCertificateSchema.parse({
      employeeId: employeeId.value,
      medicalCertificateDate: medicalCertificateDate.value,
      daysAway: daysAway.value,
      cid: cidInput.value,
      notes: notes.value,
    });

    const obj = {
      idEmployee: employeeId.value,
      employeeName: employeeName.value,
      medicalCertificateDate: medicalCertificateDate.value,
      daysAway: Number(daysAway.value),
      cid: cidInput.value,
      description: cidDescription.value,
      observation: notes.value || "",
    };

    try {
      await createMedicalCertificates(obj);
      const result = await successMessage("Atestado registrado com sucesso!");
      if (result.isConfirmed) {
        router.push("/atestados");
        return;
      }
    } catch (err) {
      console.log("Erro ao registrar atestado:", err);
      await errorMessage("Erro ao registrar atestado. Tente novamente.");
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      err.issues.forEach((e: any) => {
        const path = e.path[0] as keyof typeof errors.value;
        if (path in errors.value) {
          errors.value[path] = e.message;
        }
      });
    }
  }
};

const handleBack = () => {
  router.push("/atestados");
};
</script>

<template>
  <div class="bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="w-full mb-4 flex justify-start">
      <Button label="Voltar" @click="handleBack" />
    </div>

    <div
      class="bg-white p-8 rounded-lg shadow-sm w-full border border-gray-200"
    >
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Registrar Atestado</h1>
      <p class="text-gray-600 mb-6">Preencha os dados do atestado</p>

      <div class="space-y-4">
        <div class="flex flex-col">
          <label class="mb-1 font-medium text-gray-700">Colaborador</label>
          <select
            v-model="employeeId"
            @change="
              employeeName =
                collaborators.find((c) => c.id === employeeId)?.name || ''
            "
            class="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Selecione um colaborador</option>
            <option v-for="c in collaborators" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm mt-1">{{ errors.employeeId }}</span>
        </div>

        <Input
          v-model="medicalCertificateDate"
          label="Data e Hora do Atestado"
          type="datetime-local"
          placeholder="DD/MM/AAAA"
          :error="errors.medicalCertificateDate"
        />

        <Input
          v-model="daysAway"
          label="Quantidade de dias de afastamento"
          type="number"
          min="1"
          max="365"
          placeholder="1 a 365"
          :error="errors.daysAway"
        />

        <div class="relative">
          <Input
            v-model="cidInput"
            label="CID (código da doença)"
            type="text"
            placeholder="Busque o CID"
            :error="errors.cid"
          >
            <template #append>
              <div v-if="loadingCid" class="flex items-center pr-2">
                <div
                  class="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"
                ></div>
              </div>
            </template>
          </Input>

          <ul
            v-if="showCidOptions && cidOptions.length"
            class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto"
          >
            <li
              v-for="option in cidOptions"
              :key="option.cid"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="selectCid(option)"
            >
              <span class="font-semibold">{{ option.cid }}</span> -
              {{ option.description }}
            </li>
          </ul>
        </div>

        <Input
          v-model="notes"
          label="Observações (opcional)"
          type="text"
          placeholder="Digite observações adicionais"
        />

        <Button label="Registrar Atestado" @click="handleRegister" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dot {
  transition: transform 0.3s ease-in-out;
}
</style>
