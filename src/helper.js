const {app, ipcMain} = require('electron');
const path = require('node:path');

export function handleHelperApi() {
    ipcMain.handle('getBasePath', (event, params) => {
        return app.isPackaged ? path.dirname(app.getAppPath()) : '';
    });
}