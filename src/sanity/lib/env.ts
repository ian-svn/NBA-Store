export const apiVersion = "2025-04-18";

const fallbackProjectId = "wpb3i9pj";
const fallbackDataset = "production";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? fallbackDataset;

/**
 * Fallback para que la tienda funcione también sin .env.local
 * (ej: preview en GitHub o primer deploy en Vercel).
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? fallbackProjectId;
