import { createApp } from "vue";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import FontAwesomeIcon from "@/icons/icons.js";
import Vue3Transitions from "vue3-transitions";
import store from "./stores";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(Vue3Transitions);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);

app.use(store);

const backend_url = import.meta.env.PROD ? "http://fakeartist.justin-letourneau.dev/backend/" : import.meta.env.VITE_BACKEND_URL
console.log("BACKEND_URL", import.meta.env.VITE_BACKEND_URL)
console.log("SOCKET IMPORT", backend_url)
app.use(
  new VueSocketIO({
    connection: SocketIO(backend_url),
    params: {
      type: ["websocket"],
    },
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

app.mount("#app");
