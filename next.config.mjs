/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: "export",
  images: {
    domains: ["lycee-augustin.mg"], // Ajoutez ici le domaine autorisé
    unoptimized: true,
  },
};

export default nextConfig;
