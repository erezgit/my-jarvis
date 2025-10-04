const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const pty = require('node-pty');
const os = require('os');

// Store terminal sessions
const terminals = new Map();

// Security: Disable remote module
app.commandLine.appendSwitch('disable-remote-module');

function createWindow() {
  // Create the browser window with secure defaults
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'My Jarvis Desktop - Electron',
    webPreferences: {
      contextIsolation: true,      // Security: Enable context isolation
      nodeIntegration: false,      // Security: Disable node integration
      sandbox: true,               // Security: Enable sandbox
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the simple terminal HTML file (more reliable)
  mainWindow.loadFile(path.join(__dirname, '../renderer/simple-terminal.html'));

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Terminal IPC handlers
  ipcMain.handle('terminal:create', (event, config) => {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: config?.cols || 80,
      rows: config?.rows || 30,
      cwd: process.env.HOME,
      env: process.env
    });

    const id = `terminal-${Date.now()}`;
    terminals.set(id, ptyProcess);

    // Forward terminal output to renderer
    ptyProcess.onData((data) => {
      mainWindow.webContents.send('terminal:data', { id, data });
    });

    ptyProcess.onExit(() => {
      terminals.delete(id);
      mainWindow.webContents.send('terminal:exit', { id });
    });

    return { id, shell, pid: ptyProcess.pid };
  });

  ipcMain.on('terminal:write', (event, { id, data }) => {
    const terminal = terminals.get(id);
    if (terminal) {
      terminal.write(data);
    }
  });

  ipcMain.handle('terminal:resize', (event, { id, cols, rows }) => {
    const terminal = terminals.get(id);
    if (terminal) {
      terminal.resize(cols, rows);
    }
    return { success: true };
  });

  // File system IPC handlers (simplified for demo)
  ipcMain.handle('fs:read', async (event, filePath) => {
    const fs = require('fs').promises;
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { success: true, content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('fs:write', async (event, { path: filePath, content }) => {
    const fs = require('fs').promises;
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Clean up terminals on window close
  mainWindow.on('closed', () => {
    terminals.forEach(terminal => terminal.kill());
    terminals.clear();
  });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event) => {
    event.preventDefault();
  });
});