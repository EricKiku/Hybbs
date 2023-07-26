const { app, BrowserWindow } = require("electron")

const creatWindow = () => {

    const mainWin = new BrowserWindow({
        height: 900,
        width: 1400
    })

    mainWin.loadURL("http://localhost:5173/")
}

app.whenReady().then(() => {
    creatWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})