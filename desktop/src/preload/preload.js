const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('rapidAPI', {
  // Config
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (key, value) => ipcRenderer.invoke('set-config', key, value),

  // File system
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  saveFile: (name, content) => ipcRenderer.invoke('save-file', name, content),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),

  // Navigation events (triggered from menu)
  onNavigate: (callback) => ipcRenderer.on('navigate', (_, route) => callback(route)),
  onOpenFile: (callback) => ipcRenderer.on('open-file', (_, data) => callback(data)),
  onOpenFolder: (callback) => ipcRenderer.on('open-folder', (_, data) => callback(data)),
  onExportReport: (callback) => ipcRenderer.on('export-report', () => callback()),

  // Window controls
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),

  // Utilities
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getVersion: () => ipcRenderer.invoke('get-app-version'),

  // Platform
  platform: process.platform,
});
