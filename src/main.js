import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import eventBus from "vue3-eventbus"
// 引入router
import router from "./router/router"

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(createPinia())
app.use(eventBus)
app.mount('#app')

