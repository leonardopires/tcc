/// <reference types="vite/client" />
interface ImportMetaEnv{
  readonly REVOICER_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}