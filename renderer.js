// 全局注册对象：buttonGroupEvent


// 菜单按钮组单击
export const menuButtonClick = (type) => {
    if (type === 'min') {
        buttonGroupEvent.minimization()
    } else if (type === 'max') {
        buttonGroupEvent.maximize()
    } else if (type === 'close') {
        buttonGroupEvent.close()
    } else if (type === 'unmaximize') {
        buttonGroupEvent.unmaximize()
    }
}