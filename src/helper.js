const {app, ipcMain} = require('electron');
const path = require('node:path');

export function handleHelperApi() {
    ipcMain.handle('getBasePath', (event, params) => {
        return path.dirname(app.getAppPath());
    });
}