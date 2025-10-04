// Terminal initialization
let terminal;
let fitAddon;
let terminalId;

// Try to load xterm modules
let Terminal, FitAddon;
try {
  // Try requiring xterm modules (for Electron with nodeIntegration)
  const xterm = require('xterm');
  Terminal = xterm.Terminal;
  const fitModule = require('xterm-addon-fit');
  FitAddon = fitModule.FitAddon;
} catch (e) {
  console.log('Could not require xterm modules, will load via script tags');
  // If require doesn't work, modules should be loaded via script tags
  Terminal = window.Terminal;
  FitAddon = window.FitAddon;
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Display version information
  document.getElementById('electron-version').textContent = '33.2.1';
  document.getElementById('node-version').textContent = '24.3.0';

  // Check if Terminal is available
  if (!Terminal) {
    console.error('Terminal not loaded. Creating fallback UI.');
    document.getElementById('terminal').innerHTML = '<div style="color: red; padding: 20px;">Terminal module not loaded. Please check xterm.js installation.</div>';
    return;
  }

  // Create and configure terminal
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: '#0a0a0a',
      foreground: '#d4d4d4',
      cursor: '#ffffff',
      cursorAccent: '#000000',
      selection: '#4a9eff40',
      black: '#000000',
      red: '#ff5555',
      green: '#50fa7b',
      yellow: '#f1fa8c',
      blue: '#4a9eff',
      magenta: '#ff79c6',
      cyan: '#8be9fd',
      white: '#bfbfbf',
      brightBlack: '#4d4d4d',
      brightRed: '#ff6e6e',
      brightGreen: '#69ff94',
      brightYellow: '#ffffa5',
      brightBlue: '#6ab7ff',
      brightMagenta: '#ff92df',
      brightCyan: '#a4ffff',
      brightWhite: '#ffffff'
    }
  });

  // Create fit addon for terminal resizing
  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  // Open terminal in DOM element
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();

  // Create backend terminal process
  try {
    const result = await window.electronAPI.terminal.create({
      cols: terminal.cols,
      rows: terminal.rows
    });
    terminalId = result.id;
    
    console.log(`Terminal created: ${terminalId} (PID: ${result.pid})`);
    
    // Write welcome message
    terminal.writeln('\x1b[1;32mWelcome to My Jarvis Desktop Terminal!\x1b[0m');
    terminal.writeln('\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
    terminal.writeln('Type \x1b[1;33m"Hi Jarvis"\x1b[0m to get started or any command to execute.');
    terminal.writeln('');
  } catch (error) {
    console.error('Failed to create terminal:', error);
    terminal.writeln('\x1b[1;31mError: Failed to create terminal process\x1b[0m');
  }

  // Handle terminal input
  terminal.onData(data => {
    if (terminalId) {
      // Check for special commands
      if (data.includes('Hi Jarvis') || data.includes('hi jarvis')) {
        // This is where the AI agent would respond
        // For now, just show a demo response
        setTimeout(() => {
          const response = '\r\n\x1b[1;36m🤖 Jarvis:\x1b[0m Hello! I\'m ready to help you create and organize your knowledge.\r\n' +
                          'I can help you with:\r\n' +
                          '  • Creating documents and notes\r\n' +
                          '  • Organizing your files\r\n' +
                          '  • Generating content\r\n' +
                          '  • Managing your workspace\r\n\r\n' +
                          'What would you like to work on today?\r\n';
          terminal.write(response);
        }, 500);
      }
      
      // Send input to backend terminal
      window.electronAPI.terminal.write(terminalId, data);
    }
  });

  // Handle terminal output from backend
  window.electronAPI.terminal.onData((id, data) => {
    if (id === terminalId) {
      terminal.write(data);
    }
  });

  // Handle terminal exit
  window.electronAPI.terminal.onExit((id) => {
    if (id === terminalId) {
      terminal.writeln('\r\n\x1b[1;31mTerminal process exited\x1b[0m');
      terminalId = null;
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (fitAddon) {
      fitAddon.fit();
      if (terminalId) {
        window.electronAPI.terminal.resize(terminalId, terminal.cols, terminal.rows);
      }
    }
  });
});

// Terminal control functions
function clearTerminal() {
  if (terminal) {
    terminal.clear();
  }
}

function restartTerminal() {
  if (terminal && terminalId) {
    terminal.writeln('\r\n\x1b[1;33mRestarting terminal...\x1b[0m\r\n');
    // In a real implementation, we would kill the current terminal and create a new one
    // For now, just clear it
    setTimeout(() => {
      terminal.clear();
      terminal.writeln('\x1b[1;32mTerminal restarted!\x1b[0m');
      terminal.writeln('');
    }, 500);
  }
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+K or Cmd+K to clear terminal
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    clearTerminal();
  }
  
  // Ctrl+R or Cmd+R to restart terminal (disabled to prevent page reload)
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    restartTerminal();
  }
});