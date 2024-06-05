const path = require('path');
const fs = require('fs');
const {app, ipcMain} = require('electron');

export function handleConfigApi() {
    ipcMain.handle('getConfig', (event, params) => {
        const configPath = app.isPackaged ? path.join(path.dirname(app.getAppPath()), 'config.json') : 'D:\\projects\\electron\\dngxpd\\config.json';

        return new Promise((res, rej) => {
            fs.readFile(configPath, 'utf-8', (err, data) => {
                if (err) {
                    console.error('读取配置文件出错：', err);
                    return;
                }

                try {
                    const config = JSON.parse(data);
                    console.log('配置已读取：', config);
                    res(config)
                } catch (err) {
                    console.error('解析配置文件出错：', err);
                }
            });
        });
    });
}
