require("dotenv").config();
import axios from "axios";
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  loading: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "質問箱",
    htmlAttrs: {
      lang: "ja",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" },
      {
        hid: "description",
        name: "description",
        content: "質問箱です",
      },
      { hid: "og:site_name", property: "og:site_name", content: "質問箱" },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://unique-donut-e9d728.netlify.app/",
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "質問や過去の回答はこちらから",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "質問箱です",
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          "https://image.shutterstock.com/image-vector/sample-stamp-grunge-texture-vector-600w-1389188327.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/common.js", { src: "@/plugins/vue-scrollto.js" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    ["vue-scrollto/nuxt", { duration: 300 }],
    "nuxt-fontawesome",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: "/",
    proxy: true,
    prefix: "/",
  },

  fontawesome: {
    component: "fa",
  },

  proxy: {
    "/api/": {
      target: "https://api.twitter.com",
      pathRewrite: {
        "^/api/": "/",
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  publicRuntimeConfig: {
    MICROCMS_KEY: process.env.MICROCMS_Q_BOX_KEY || "",
    CONSUMER_KEY: process.env.CONSUMER_KEY || "",
    CONSUMER_KEY_SECRET: process.env.CONSUMER_KEY_SECRET || "",
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY || "",
    ACCESS_TOKEN_KEY_SECRET: process.env.ACCESS_TOKEN_KEY_SECRET || "",
  },
  env: {
    MICROCMS_KEY: process.env.MICROCMS_Q_BOX_KEY || "",
    CONSUMER_KEY: process.env.CONSUMER_KEY || "",
    CONSUMER_KEY_SECRET: process.env.CONSUMER_KEY_SECRET || "",
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY || "",
    ACCESS_TOKEN_KEY_SECRET: process.env.ACCESS_TOKEN_KEY_SECRET || "",
  },
};
