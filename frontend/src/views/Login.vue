<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { z } from "zod";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import { errorMessage, successMessage } from "@/utils/alerts";
import { login } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const email = ref("");
const password = ref("");
const errors = ref({ email: "", password: "" });

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

const handleLogin = async () => {
  errors.value.email = "";
  errors.value.password = "";

  try {
    loginSchema.parse({
      email: email.value,
      password: password.value,
    });

    try {
      const result = await login(email.value, password.value);
      if (!result) {
        await errorMessage("E-mail ou senha inválidos. Tente novamente.");
        return;
      }
      const authStore = useAuthStore();
      await authStore.fetchUser();
      await successMessage("Login realizado com sucesso!");
      router.push("/");
      return;
    } catch (err: any) {
      if (err.status === 401) {
        await errorMessage("E-mail ou senha inválidos. Tente novamente.");
        return;
      }
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      err.issues.forEach((e) => {
        if (e.path[0] === "email") {
          errors.value.email = e.message;
        }
        if (e.path[0] === "password") {
          errors.value.password = e.message;
        }
      });
    }
  }
};

const signup = () => router.push("/signup");
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div
      class="bg-blue-600 rounded-full h-16 w-16 mb-6 flex items-center justify-cener"
    >
      <img
        src="@/assets/imgs/plus-medical.png"
        alt="logo cruz de medico"
        class="w-10 mx-auto"
      />
    </div>

    <div
      class="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200"
    >
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">
        Bem vindo
      </h1>
      <p class="text-gray-600 text-center mb-6">Faça o login para entrar</p>

      <div class="space-y-4">
        <Input
          v-model="email"
          label="Email"
          type="email"
          placeholder="Digite seu email"
          :error="errors.email"
        />

        <Input
          v-model="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          :error="errors.password"
        />

        <Button label="Login" @click="handleLogin" />
      </div>

      <p class="mt-6 text-center text-sm text-gray-600">
        Não tem uma conta?
        <a @click="signup" class="text-blue-600 hover:text-blue-500"
          >Clique aqui</a
        >
      </p>
    </div>
  </div>
</template>
