import { defineStore } from "pinia";

export const storeOfUser = defineStore("user", {
    state: () => {
        return {
            currentUser: {
                u_id: "",
                u_email: "",
                u_password: "",
                u_nick: ""
            }
        }
    },
    actions: {
        setCurrentUser(u_id, u_email, u_password, u_nick) {
            this.currentUser.u_id = u_id;
            this.currentUser.u_email = u_email;
            this.currentUser.u_password = u_password;
            this.currentUser.u_nick = u_nick;
        }
    }
})