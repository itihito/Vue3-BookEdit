import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // v-iconの表示に必要
import store from "./store";

createApp(App).use(router).use(vuetify).use(store).mount("#app");
