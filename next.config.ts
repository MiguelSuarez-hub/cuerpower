import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Evidencia de actividades: máx. 5 MB de imagen + margen para el
      // overhead de multipart/form-data.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
