// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('db', {
    getRecords: (params) => ipcRenderer.invoke('getRecords', params),
    getZones: (params) => ipcRenderer.invoke('getZones', params),
    getTypes: (params) => ipcRenderer.invoke('getTypes', params),
    getOverall: (params) => ipcRenderer.invoke('getOverall', params),
});

contextBridge.exposeInMainWorld('config', {
    getConfig: () => ipcRenderer.invoke('getConfig'),
});

contextBridge.exposeInMainWorld('helper', {
    getBasePath: () => ipcRenderer.invoke('getBasePath'),
});