const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const pty = require('node-pty');
const os = require('os');

let mainWindow;
const terminals = {};
const fileWatchers = new Map();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Terminal backend
ipcMain.on('terminal-create', (event, id) => {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash';
  
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  terminals[id] = ptyProcess;

  ptyProcess.on('data', (data) => {
    event.reply('terminal-data-' + id, data);
  });

  ptyProcess.on('exit', () => {
    delete terminals[id];
    event.reply('terminal-exit-' + id);
  });
});

ipcMain.on('terminal-data', (event, { id, data }) => {
  if (terminals[id]) {
    terminals[id].write(data);
  }
});

ipcMain.on('terminal-resize', (event, { id, cols, rows }) => {
  if (terminals[id]) {
    terminals[id].resize(cols, rows);
  }
});

// File System IPC Handlers
ipcMain.handle('get-home-dir', () => {
  return os.homedir();
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Directory',
    buttonLabel: 'Select Folder'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('read-directory', async (event, dirPath) => {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const results = await Promise.all(items.map(async (item) => {
      const fullPath = path.join(dirPath, item.name);
      const stats = await fs.stat(fullPath);
      return {
        name: item.name,
        path: fullPath,
        isDirectory: item.isDirectory(),
        size: stats.size,
        modified: stats.mtime,
        extension: item.isDirectory() ? '' : path.extname(item.name)
      };
    }));
    
    // Sort: directories first, then files, alphabetically
    results.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    return results;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    return {
      content,
      path: filePath,
      name: path.basename(filePath),
      size: stats.size,
      modified: stats.mtime,
      extension: path.extname(filePath)
    };
  } catch (error) {
    console.error('Error reading file:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-file-stats', async (event, filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch (error) {
    console.error('Error getting file stats:', error);
    return { error: error.message };
  }
});

ipcMain.on('watch-file', (event, filePath) => {
  if (!fileWatchers.has(filePath)) {
    const watcher = fsSync.watch(filePath, (eventType) => {
      if (eventType === 'change') {
        event.reply('file-changed', filePath);
      }
    });
    fileWatchers.set(filePath, watcher);
  }
});

ipcMain.on('unwatch-file', (event, filePath) => {
  if (fileWatchers.has(filePath)) {
    fileWatchers.get(filePath).close();
    fileWatchers.delete(filePath);
  }
});