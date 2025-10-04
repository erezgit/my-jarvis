const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Terminal operations
  terminal: {
    create: (config) => ipcRenderer.invoke('terminal:create', config),
    write: (id, data) => ipcRenderer.send('terminal:write', { id, data }),
    resize: (id, cols, rows) => ipcRenderer.invoke('terminal:resize', { id, cols, rows }),
    onData: (callback) => {
      ipcRenderer.on('terminal:data', (event, { id, data }) => callback(id, data));
    },
    onExit: (callback) => {
      ipcRenderer.on('terminal:exit', (event, { id }) => callback(id));
    }
  },

  // File system operations
  fs: {
    readFile: (path) => ipcRenderer.invoke('fs:read', path),
    writeFile: (path, content) => ipcRenderer.invoke('fs:write', { path, content })
  },

  // System information
  platform: process.platform
});

console.log('Preload script loaded successfully');