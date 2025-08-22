interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string; // Tornando opcional
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
