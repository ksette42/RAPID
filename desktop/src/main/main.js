const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

const store = new Store({
  defaults: {
    apiUrl: 'https://app.rapid.dev',
    apiKey: '',
    theme: 'dark',
    windowBounds: { width: 1200, height: 800 },
  },
});

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
let mainWindow = null;
let tray = null;

// ─── App Settings ────────────────────────────────────────────────────────────
app.setName('RAPID');

if (process.platform === 'darwin') {
  app.dock?.setIcon(path.join(__dirname, '../../assets/icon.png'));
}

// ─── Main Window ─────────────────────────────────────────────────────────────
function createWindow() {
  const { width, height } = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 900,
    minHeight: 600,
    title: 'RAPID',
    backgroundColor: '#0a0a1a',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: process.platform !== 'darwin',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
    show: false,
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Save window size
  mainWindow.on('resize', () => {
    store.set('windowBounds', mainWindow.getBounds());
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ─── System Tray ─────────────────────────────────────────────────────────────
function createTray() {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  const icon = fs.existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
    : nativeImage.createEmpty();

  tray = new Tray(icon);
  tray.setToolTip('RAPID — Code Analyzer');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open RAPID', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    { label: 'New Analysis', click: () => { mainWindow?.show(); mainWindow?.webContents.send('navigate', '/analyze'); } },
    { type: 'separator' },
    { label: 'Dashboard', click: () => shell.openExternal(store.get('apiUrl') + '/dashboard') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => { mainWindow?.show(); mainWindow?.focus(); });
}

// ─── Menu Bar ─────────────────────────────────────────────────────────────────
function createMenu() {
  const template = [
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File for Analysis...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Code Files', extensions: ['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'java', 'cs', 'cpp', 'c', 'rb', 'php', 'swift', 'kt'] },
                { name: 'Data Files', extensions: ['sql', 'json', 'yaml', 'yml', 'xml'] },
                { name: 'Infrastructure', extensions: ['tf', 'hcl', 'dockerfile'] },
                { name: 'All Files', extensions: ['*'] },
              ],
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              const content = fs.readFileSync(filePath, 'utf-8');
              mainWindow?.webContents.send('open-file', { path: filePath, content });
            }
          },
        },
        {
          label: 'Open Folder for Scan...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openDirectory'],
            });
            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow?.webContents.send('open-folder', { path: result.filePaths[0] });
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Export Report...',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            mainWindow?.webContents.send('export-report');
          },
        },
        { type: 'separator' },
        process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Analysis',
      submenu: [
        {
          label: 'New Analysis',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('navigate', '/analyze'),
        },
        {
          label: 'View History',
          accelerator: 'CmdOrCtrl+H',
          click: () => mainWindow?.webContents.send('navigate', '/history'),
        },
        {
          label: 'Suggestions',
          click: () => mainWindow?.webContents.send('navigate', '/suggestions'),
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        { label: 'RAPID Documentation', click: () => shell.openExternal('https://rapid.dev/docs') },
        { label: 'Report an Issue', click: () => shell.openExternal('https://github.com/rapid-dev/rapid/issues') },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
ipcMain.handle('get-config', () => ({
  apiUrl: store.get('apiUrl'),
  apiKey: store.get('apiKey'),
  theme: store.get('theme'),
}));

ipcMain.handle('set-config', (_, key, value) => {
  store.set(key, value);
});

ipcMain.handle('read-file', (_, filePath) => {
  try {
    return { content: fs.readFileSync(filePath, 'utf-8'), error: null };
  } catch (e) {
    return { content: null, error: (e as Error).message };
  }
});

ipcMain.handle('save-file', async (_, defaultName, content) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'JSON', extensions: ['json'] },
      { name: 'Text', extensions: ['txt'] },
    ],
  });
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content, 'utf-8');
    return { saved: true, path: result.filePath };
  }
  return { saved: false };
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Code & Data Files', extensions: ['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'java', 'cs', 'sql', 'json', 'yaml', 'yml', 'tf', 'hcl', 'rb', 'php', 'swift', 'kt', 'c', 'cpp', 'sh'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    return { path: filePath, content };
  }
  return null;
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('open-external', (_, url) => shell.openExternal(url));

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('minimize-window', () => mainWindow?.minimize());
ipcMain.handle('maximize-window', () => {
  mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize();
});
ipcMain.handle('close-window', () => mainWindow?.hide());

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  createMenu();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  tray?.destroy();
});
