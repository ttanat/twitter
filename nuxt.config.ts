import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
  },
  nitro: {
    plugins: ["~/server/db/index.ts"],
  },
  css: ["vuetify/lib/styles/main.sass", "@mdi/font/css/materialdesignicons.min.css"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    plugins: [
      nodePolyfills({
        protocolImports: true,
      }),
    ],
    define: {
      "process.env.DEBUG": false
    }
  },
  modules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Roboto: true,
      // 'Noto+Sans': true,
      // Ubuntu: true,
    }
  }
})
