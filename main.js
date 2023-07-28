const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const creatWindow = () => {

    const mainWin = new BrowserWindow({
        show: false,//先不显示，等待页面文件加载完成
        height: 900,
        width: 1400,
        frame: false,//自定义窗体标题栏
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWin.loadURL("http://localhost:5173/")
    // 等待页面加载完再去让窗口显示
    mainWin.on("ready-to-show", () => {
        mainWin.show()
    })

    // 注册IPC事件函数
    ipcHandle(mainWin)
}

// 处理IPC事件函数
function ipcHandle(win) {
    ipcMain.handle("minimization", () => {
        win.minimize()
    })
    ipcMain.handle("maximize", () => {
        win.maximize()
    })
    ipcMain.handle("close", () => {
        win.close()
    })
    ipcMain.handle("unmaximize", () => {
        win.unmaximize()
    })
}





// 监听主进程准备完毕
app.whenReady().then(() => {
    creatWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
// 监听所有串口关闭
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})