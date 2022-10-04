import { createApp } from "vue";
import VueSocketIO from 'vue-3-socket.io'
import FontAwesomeIcon from "@/icons/icons.js";
import store from "./stores"

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);

app.use(store);

app.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))


app.mount("#app");
