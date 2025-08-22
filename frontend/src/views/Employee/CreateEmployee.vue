<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ZodError, z } from "zod";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import { createEmployee } from "@/services/employee-service";
import { errorMessage, successMessage } from "@/utils/alerts";

const router = useRouter();

const fullName = ref("");
const cpf = ref("");
const birthDate = ref("");
const position = ref("");
const status = ref(true);

const errors = ref({
  fullName: "",
  cpf: "",
  birthDate: "",
  position: "",
});

const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

const registerSchema = z.object({
  fullName: z.string().min(3, { message: "Nome completo deve ter no mínimo 3 caracteres." }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória." }),
  position: z.string().min(1, { message: "Cargo é obrigatório." }),
});

const validateField = (field: keyof typeof errors.value, value: any) => {
  try {
    if (field === "cpf") {
      if (value.length !== 11) {
        errors.value.cpf = "CPF deve ter 11 dígitos.";
        return;
      }
      if (!validateCPF(value)) {
        errors.value.cpf = "CPF inválido.";
        return;
      }
      errors.value.cpf = "";
    } else {
      registerSchema.pick({ [field]: true } as any).parse({ [field]: value });
      errors.value[field] = "";
    }
  } catch (err) {
    if (err instanceof ZodError) {
      errors.value[field] = err.issues[0].message;
    }
  }
};

watch(fullName, (newValue: string) => validateField("fullName", newValue));
watch(cpf, (newValue: string) => validateField("cpf", newValue));
watch(birthDate, (newValue: string) => validateField("birthDate", newValue));
watch(position, (newValue: string) => validateField("position", newValue));

const handleRegister = async () => {
  errors.value.fullName = "";
  errors.value.cpf = "";
  errors.value.birthDate = "";
  errors.value.position = "";

  try {
    registerSchema.parse({
      fullName: fullName.value,
      birthDate: birthDate.value,
      position: position.value,
    });
    
    if (cpf.value.length !== 11) {
      errors.value.cpf = "CPF deve ter 11 dígitos.";
      return;
    }
    if (!validateCPF(cpf.value)) {
      errors.value.cpf = "CPF inválido.";
      return;
    }

    await createEmployee({
      name: fullName.value,
      cpf: cpf.value,
      birthdayDate: birthDate.value,
      role: position.value,
      status: status.value ? "active" : "inactive",
    });

    await successMessage("Colaborador cadastrado com sucesso!");
    router.push("/colaboradores");
  } catch (err: any) {
    if (err instanceof ZodError) {
      err.issues.forEach((e) => {
        const path = e.path[0] as keyof typeof errors.value;
        if (path in errors.value) errors.value[path] = e.message;
      });
    } else {
      errorMessage("Erro ao cadastrar colaborador. Tente novamente mais tarde.");
    }
  }
};

const handleBack = () => {
  router.push("/colaboradores");
};
</script>

<template>
  <div class="bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="flex justify-start w-full mb-4">
      <div class="flex">
        <Button label="Voltar" @click="handleBack" />
      </div>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-sm w-full border border-gray-200">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Cadastrar Colaborador</h1>
      <p class="text-gray-600 mb-6">Preencha os dados para continuar</p>

      <div class="space-y-4">
        <Input
          v-model="fullName"
          label="Nome Completo"
          type="text"
          placeholder="Digite o nome completo"
          :error="errors.fullName"
        />

        <Input
          v-model="cpf"
          label="CPF"
          type="text"
          placeholder="Digite o CPF (somente números)"
          :error="errors.cpf"
          @input="cpf = $event.target.value.replace(/\D/g, '').slice(0, 11)"
        />

        <Input
          v-model="birthDate"
          label="Data de Nascimento"
          type="date"
          placeholder="DD/MM/AAAA"
          :error="errors.birthDate"
        />

        <Input
          v-model="position"
          label="Cargo"
          type="text"
          placeholder="Digite o cargo"
          :error="errors.position"
        />

        <div class="flex items-center space-x-2">
          <label class="block text-sm font-medium text-gray-700">Status:</label>
          <input
            id="status-toggle"
            type="checkbox"
            v-model="status"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-gray-900">{{ status ? "Ativo" : "Inativo" }}</span>
        </div>

        <Button label="Cadastrar Colaborador" @click="handleRegister" />
      </div>
    </div>
  </div>
</template>