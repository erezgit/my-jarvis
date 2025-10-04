const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const pty = require('node-pty');
const os = require('os');

let mainWindow;
const terminals = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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