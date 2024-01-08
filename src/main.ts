import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // v-iconの表示に必要
import store from "./store";
import HistoryStatePlugin from "vue-history-state";

createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(HistoryStatePlugin)
  .mount("#app");
