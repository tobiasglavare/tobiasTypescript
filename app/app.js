// TypeScript Playground - Main Application with Monaco Editor

const output = document.getElementById('output');
const languageSelect = document.getElementById('language');

let editor = null;

// Example code for each language
const examples = {
  typescript: `// Try some TypeScript code!
// You have full IntelliSense - try typing "user." below

interface User {
  name: string;
  age: number;
  greet(): string;
}

const user: User = {
  name: "Alice",
  age: 30,
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};

console.log("User:", user);
console.log(user.greet());

// Test closures
function createCounter(): { increment: () => number; value: () => number } {
  let count = 0;
  return {
    increment: () => ++count,
    value: () => count
  };
}

const counter = createCounter();
console.log("Count:", counter.increment());
console.log("Count:", counter.increment());
console.log("Count:", counter.value());`,

  javascript: `// Try some JavaScript code!
// You have full IntelliSense - try typing "user." below

const user = {
  name: "Alice",
  age: 30,
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};

console.log("User:", user);
console.log(user.greet());

// Test closures
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    value: () => count
  };
}

const counter = createCounter();
console.log("Count:", counter.increment());
console.log("Count:", counter.increment());
console.log("Count:", counter.value());

// Test 'this' keyword
const person = {
  name: "Bob",
  greet() {
    console.log("Hello, I'm " + this.name);
  }
};

person.greet();`
};

// Initialize Monaco Editor
console.log('Configuring Monaco...');

require.config({ 
  paths: { 
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' 
  }
});

console.log('Loading Monaco editor...');

require(['vs/editor/editor.main'], function() {
  console.log('Monaco loaded, initializing...');
  
  try {
    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      strict: true,
      esModuleInterop: true,
      lib: ['es2022', 'dom']
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true
    });

    // Enable validation
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });

    // Load saved code or use example
    const savedCode = localStorage.getItem('playground-code');
    const savedLanguage = localStorage.getItem('playground-language') || 'typescript';
    languageSelect.value = savedLanguage;
    
    const initialCode = savedCode || examples[savedLanguage];
    const initialLanguage = savedLanguage === 'typescript' ? 'typescript' : 'javascript';

    console.log('Creating editor instance...');
    
    // Clear loading text
    const editorContainer = document.getElementById('editor');
    editorContainer.innerHTML = '';
    
    // Create editor
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: initialCode,
      language: initialLanguage,
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    parameterHints: { enabled: true }
  });


  // Add Ctrl+Enter keybinding to run code
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);

  // Auto-save on change
  editor.onDidChangeModelContent(() => {
    saveCode();
  });

  appendOutput('info', 'TypeScript Playground ready. Press Ctrl+Enter to run code.');
    appendOutput('info', 'IntelliSense enabled - try typing to see suggestions!');
    console.log('Editor ready!');
  } catch (err) {
    console.error('Error initializing editor:', err);
    document.getElementById('editor').innerHTML = '<div style="color: red; padding: 20px;">Error loading editor: ' + err.message + '</div>';
  }
}, function(err) {
  console.error('Failed to load Monaco:', err);
  document.getElementById('editor').innerHTML = '<div style="color: red; padding: 20px;">Failed to load Monaco editor. Check console for details.</div>';
});

// Helper functions
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    fractionalSecondDigits: 3
  });
}

function formatValue(value) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'function') return value.toString();
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
}

function appendOutput(type, ...args) {
  const line = document.createElement('div');
  line.className = `output-line ${type}`;
  
  const timestamp = document.createElement('span');
  timestamp.className = 'timestamp';
  timestamp.textContent = getTimestamp();
  
  const content = args.map(formatValue).join(' ');
  
  line.appendChild(timestamp);
  line.appendChild(document.createTextNode(content));
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function createSandboxConsole() {
  return {
    log: (...args) => appendOutput('log', ...args),
    error: (...args) => appendOutput('error', ...args),
    warn: (...args) => appendOutput('warn', ...args),
    info: (...args) => appendOutput('info', ...args),
    clear: () => clearOutput()
  };
}

function compileTypeScript(code) {
  try {
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.None,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: false
      }
    });
    return { success: true, code: result.outputText };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function runCode() {
  if (!editor) return;
  
  const code = editor.getValue();
  const language = languageSelect.value;
  
  let jsCode = code;
  
  if (language === 'typescript') {
    const compiled = compileTypeScript(code);
    if (!compiled.success) {
      appendOutput('error', 'Compilation Error:', compiled.error);
      return;
    }
    jsCode = compiled.code;
  }
  
  const sandboxConsole = createSandboxConsole();
  
  try {
    const sandbox = new Function('console', `
      "use strict";
      ${jsCode}
    `);
    
    const result = sandbox(sandboxConsole);
    
    if (result !== undefined) {
      appendOutput('result', '→', result);
    }
  } catch (error) {
    appendOutput('error', 'Runtime Error:', error.message);
  }
}

function clearOutput() {
  output.innerHTML = '';
}


function saveCode() {
  if (!editor) return;
  localStorage.setItem('playground-code', editor.getValue());
  localStorage.setItem('playground-language', languageSelect.value);
}

// Check if current code is an example
function isExampleCode(code) {
  return code.trim().startsWith('// Try some TypeScript') || 
         code.trim().startsWith('// Try some JavaScript');
}

// Handle language change
languageSelect.addEventListener('change', () => {
  if (!editor) return;
  
  const newLanguage = languageSelect.value;
  const monacoLanguage = newLanguage === 'typescript' ? 'typescript' : 'javascript';
  
  // Change editor language
  monaco.editor.setModelLanguage(editor.getModel(), monacoLanguage);
  
  // Swap example if using default code
  if (isExampleCode(editor.getValue())) {
    editor.setValue(examples[newLanguage]);
  }
  
  saveCode();
  clearOutput();
  appendOutput('info', `Switched to ${newLanguage === 'typescript' ? 'TypeScript' : 'JavaScript'} mode.`);
});

// Resizable panels
const divider = document.getElementById('divider');
let isResizing = false;

divider.addEventListener('mousedown', () => {
  isResizing = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  
  const container = document.querySelector('main');
  const containerRect = container.getBoundingClientRect();
  const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
  
  const panels = document.querySelectorAll('.panel');
  panels[0].style.flex = `0 0 ${percentage}%`;
  panels[1].style.flex = `0 0 ${100 - percentage}%`;
});

document.addEventListener('mouseup', () => {
  isResizing = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    clearOutput();
  }
});
