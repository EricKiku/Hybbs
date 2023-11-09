import { defineStore } from "pinia"

export const storeOfApi = defineStore("api", {
    state: () => {
        return {
            baseURL: "http://192.168.43.70",
            port: ":1234"
        }
    },
    actions: {
        getBaseUrl() {
            return this.baseURL
        },
        getPort() {
            return this.port
        }
    }
})