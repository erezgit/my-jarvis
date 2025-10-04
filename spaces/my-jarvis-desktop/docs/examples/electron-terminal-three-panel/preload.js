const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// file system operations without directly accessing Node.js modules
contextBridge.exposeInMainWorld('fileAPI', {
  // Read directory contents
  readDirectory: async (dirPath) => {
    return await ipcRenderer.invoke('read-directory', dirPath);
  },
  
  // Read file content
  readFile: async (filePath) => {
    return await ipcRenderer.invoke('read-file', filePath);
  },
  
  // Get home directory
  getHomeDir: async () => {
    return await ipcRenderer.invoke('get-home-dir');
  },
  
  // Open directory picker dialog
  selectDirectory: async () => {
    return await ipcRenderer.invoke('select-directory');
  },
  
  // Get file stats
  getFileStats: async (filePath) => {
    return await ipcRenderer.invoke('get-file-stats', filePath);
  },
  
  // Watch for file changes
  watchFile: (filePath, callback) => {
    ipcRenderer.on('file-changed', (event, path) => {
      if (path === filePath) {
        callback(path);
      }
    });
  },
  
  // Stop watching file
  unwatchFile: (filePath) => {
    ipcRenderer.send('unwatch-file', filePath);
  }
});

// Keep the existing terminal API
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    const validChannels = ['terminal-create', 'terminal-data', 'terminal-resize'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  on: (channel, func) => {
    const validChannels = ['terminal-data-', 'terminal-exit-'];
    if (validChannels.some(valid => channel.startsWith(valid))) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});