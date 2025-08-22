import { useAuthStore } from "@/stores/auth";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  // Página pública de login
  {
    path: "/login",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },
  {
    path: "/signup",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "signup",
        component: () => import("@/views/SignUp.vue"),
      },
    ],
  },

  {
    path: "/",
    component: () => import("@/layouts/WithSidebar.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Dashboard.vue"),
      },
    ],
  },

  {
    path: "/colaboradores",
    component: () => import("@/layouts/WithSidebar.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "listemployees",
        component: () => import("@/views/Employee/ListEmployee.vue"),
      },
    ],
  },
  {
    path: "/colaboradores/cadastrar",
    component: () => import("@/layouts/WithSidebar.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "createemployees",
        component: () => import("@/views/Employee/CreateEmployee.vue"),
      },
    ],
  },
  {
    path: "/atestados/cadastrar",
    component: () => import("@/layouts/WithSidebar.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "listMedicalCertificate",
        component: () =>
          import("@/views/MedicalCertificate/CreateMedicalCertificate.vue"),
      },
    ],
  },
  {
    path: "/atestados",
    component: () => import("@/layouts/WithSidebar.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "createMedicalCertificate",
        component: () =>
          import("@/views/MedicalCertificate/ListMedicalCertificate.vue"),
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes,
});

router.beforeEach(async (to: any, from: any, next: any) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      await authStore.fetchUser();
    }

    if (!authStore.user) {
      return next({ name: "login" });
    }
  }

  if ((to.name === "login" || to.name === "signup") && authStore.user) {
    return next({ path: "/" });
  }
  next();
});

export default router;
