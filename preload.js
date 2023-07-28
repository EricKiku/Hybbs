// 预加载脚本
const { contextBridge, ipcRenderer } = require("electron")

// 注册标题栏按钮事件
contextBridge.exposeInMainWorld('buttonGroupEvent', {
    minimization: () => {
        return ipcRenderer.invoke("minimization")
    },
    maximize: () => {
        return ipcRenderer.invoke("maximize")
    },
    close: () => {
        return ipcRenderer.invoke("close")
    },
    unmaximize: () => {
        return ipcRenderer.invoke("unmaximize")
    }
})