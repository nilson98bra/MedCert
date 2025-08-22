<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { successMessage } from "@/utils/alerts";

const router = useRouter();
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchUser();
});

const logout = async () => {
  await authStore.logout();
  await successMessage("Logout realizado com sucesso!");
  router.push("/login");
};
</script>
<template>
  <div class="relative flex min-h-screen bg-gray-50">
    <button
      @click="toggleSidebar"
      class="md:hidden fixed top-4 z-50 p-2 text-blue-600 bg-white rounded-md shadow transition-all duration-300 border border-blue-800"
      :class="isSidebarOpen ? 'right-4 border border-blue-800' : 'left-4'"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </button>

    <aside
      class="flex flex-col justify-between w-52 bg-blue-600 text-white fixed h-full p-4 transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0"
      :class="{ '-translate-x-full': !isSidebarOpen }"
    >
      <nav class="space-y-2">
        <div class="flex justify-center mt-4">
          <img
            src="@/assets/imgs/logo.png"
            alt="Logo"
            class="w-32 mb-4 mx-auto"
          />
        </div>

        <router-link
          to="/"
          class="block p-2 hover:bg-blue-800 rounded transition"
          active-class="bg-blue-800"
        >
          Dashboard
        </router-link>
        <router-link
          to="/colaboradores"
          class="block p-2 hover:bg-blue-800 rounded transition"
          active-class="bg-blue-800"
        >
          Colaboradores
        </router-link>
        <router-link
          to="/atestados"
          class="block p-2 hover:bg-blue-800 rounded transition"
          active-class="bg-blue-800"
        >
          Atestados
        </router-link>
      </nav>
      <button @click="logout" class="bg-blue-800 p-2 w-full rounded-md">
        Sair
      </button>
    </aside>

    <main class="flex-1 p-6 transition-all duration-300 ease-in-out md:ml-52">
      <router-view />
    </main>
  </div>
</template>
