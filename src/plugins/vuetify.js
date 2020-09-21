import Vue from "vue";
import Vuetify from "vuetify/lib";
import es from "vuetify/es5/locale/es";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#6599FF",
        secondary: "#FFFFFF",
        accent: "#8676ff",
        error: "#DC4A4A",
        info: "#ffba69",
        success: "#2CBF6C",
        warning: "#FF708B",
        text_dark: "#232365",
        text_light: "#8786AD",
        background: "#f6f5ff",
      },
    },
  },
  lang: {
    locales: { es },
    current: "es",
  },
});