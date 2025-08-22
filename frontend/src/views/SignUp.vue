<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { z } from "zod";
import Input from "@/components/Input.vue";
import { cadUser } from "@/services/user-service";
import { errorMessage, successMessage } from "@/utils/alerts";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errors = ref({ name: "", email: "", password: "", confirmPassword: "" });

const signupSchema = z
  .object({
    name: z.string().min(1, { message: "O nome é obrigatório." }),
    email: z.string().email({ message: "E-mail inválido." }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

const handleSignup = async () => {
  errors.value.name = "";
  errors.value.email = "";
  errors.value.password = "";
  errors.value.confirmPassword = "";

  try {
    signupSchema.parse({
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    try {
      const result = await cadUser({
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });

      if (result) {
        const messageResult = await successMessage(
          "Cadastro realizado com sucesso!",
        );
        if (messageResult.isConfirmed) router.push("/login");
        return;
      }

      errorMessage("Erro ao cadastrar usuário.");
    } catch (err: any) {
      err.status === 409
        ? await errorMessage("E-mail já cadastrado. Tente outro.")
        : err.status === 500
          ? await errorMessage(
              "Erro interno do servidor. Tente novamente mais tarde.",
            )
          : await errorMessage(
              "Erro ao cadastrar usuário. Tente novamente mais tarde.",
            );
      return;
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      err.issues.forEach((e) => {
        if (e.path[0] === "name") {
          errors.value.name = e.message;
        }
        if (e.path[0] === "email") {
          errors.value.email = e.message;
        }
        if (e.path[0] === "password") {
          errors.value.password = e.message;
        }
        if (e.path[0] === "confirmPassword") {
          errors.value.confirmPassword = e.message;
        }
      });
    }
  }
};

const login = () => router.push("/");
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
        Criar uma conta
      </h1>
      <p class="text-gray-600 text-center mb-6">Cadastre-se para entrar</p>

      <div class="space-y-4">
        <Input
          v-model="name"
          label="Nome"
          type="text"
          placeholder="Digite seu nome"
          :error="errors.name"
        />

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

        <Input
          v-model="confirmPassword"
          label="Confirme a senha"
          type="password"
          placeholder="Digite a senha novamente"
          :error="errors.confirmPassword"
        />

        <button
          @click="handleSignup"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
      </div>


  <p class="mt-6 text-center text-sm text-gray-600">
    Já tem uma conta?
    <a
      href="#"
      @click.prevent="login"
      class="text-blue-600 hover:text-blue-500 cursor-pointer"
    >
      Faça o login aqui
    </a>
  </p>
    </div>
  </div>
</template>
