import { createApp } from "vue";
import App from "./App.vue";
import FivemResourcePlugin from "./FivemResourcePlugin";

createApp(App).use(FivemResourcePlugin, { debug: true }).mount("#app");
