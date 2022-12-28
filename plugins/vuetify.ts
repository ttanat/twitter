import { createVuetify } from "vuetify/lib/framework.mjs";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        dark: {
          colors: {
            primary: "#299ded",
            secondary:  "#71767b",
            background: "#000",
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
