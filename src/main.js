import { createApp } from "vue";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import FontAwesomeIcon from "@/icons/icons.js";
import Vue3Transitions from 'vue3-transitions'
import store from "./stores";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(Vue3Transitions)

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);

app.use(store);

app.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      rejectUnauthorized: false
    }),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

app.mount("#app");
