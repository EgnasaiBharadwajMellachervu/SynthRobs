// Arduino Components Database
const COMPONENTS_DB = {
  controllers: [
    { id: 'uno', name: 'Arduino Uno', icon: '🎛️', pins: 14, analogPins: 6 },
    { id: 'nano', name: 'Arduino Nano', icon: '🎛️', pins: 12, analogPins: 8 },
    { id: 'mega', name: 'Arduino Mega', icon: '🎛️', pins: 54, analogPins: 16 }
  ],
  inputs: [
    { id: 'button', name: 'Button', icon: '🔘', pins: 1, description: 'Push button switch' },
    { id: 'pot', name: 'Potentiometer', icon: '🎚️', pins: 3, description: 'Variable resistor' },
    { id: 'photoresistor', name: 'Light Sensor', icon: '💡', pins: 1, description: 'LDR photoresistor' },
    { id: 'temperature', name: 'Temperature', icon: '🌡️', pins: 1, description: 'Temp sensor' },
    { id: 'ultrasonic', name: 'Ultrasonic', icon: '📏', pins: 2, description: 'Distance sensor' }
  ],
  outputs: [
    { id: 'led', name: 'LED', icon: '💡', pins: 2, description: 'Light emitting diode' },
    { id: 'buzzer', name: 'Buzzer', icon: '🔔', pins: 2, description: 'Audio buzzer' },
    { id: 'servo', name: 'Servo Motor', icon: '⚙️', pins: 3, description: 'Servo motor' },
    { id: 'dcmotor', name: 'DC Motor', icon: '⚙️', pins: 2, description: 'DC motor with driver' },
    { id: 'lcd', name: 'LCD Display', icon: '📺', pins: 16, description: '16x2 LCD display' }
  ],
  power: [
    { id: 'battery5v', name: '5V Battery', icon: '🔋', pins: 2, description: '5V power source' },
    { id: 'battery9v', name: '9V Battery', icon: '🔋', pins: 2, description: '9V power source' }
  ]
};

// Application State
const app = {
  selectedController: null,
  components: [],
  canvas: [],
  filter: 'all',
  selectedComponent: null
};

// Initialize Application
function init() {
  setupEventListeners();
  renderComponents();
  setupTabs();
}

// Setup Event Listeners
function setupEventListeners() {
  // Search
  document.getElementById('component-search').addEventListener('input', (e) => {
    filterComponents(e.target.value);
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      app.filter = e.target.dataset.filter;
      renderComponents();
    });
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchTab(e.target.dataset.tab);
    });
  });

  // Canvas
  document.getElementById('clear-btn').addEventListener('click', clearCanvas);
  document.getElementById('generate-btn').addEventListener('click', generateCode);
  document.getElementById('copy-code-btn').addEventListener('click', copyCode);
}

// Render Components
function renderComponents() {
  const grid = document.getElementById('components-grid');
  grid.innerHTML = '';
  
  let componentsToShow = [];
  
  if (app.filter === 'all') {
    Object.values(COMPONENTS_DB).forEach(cat => {
      componentsToShow = [...componentsToShow, ...cat];
    });
  } else {
    componentsToShow = COMPONENTS_DB[app.filter] || [];
  }
  
  componentsToShow.forEach(component => {
    const div = document.createElement('div');
    div.className = 'component-item';
    div.draggable = true;
    div.innerHTML = `
      <span class="component-icon">${component.icon}</span>
      <span class="component-name">${component.name}</span>
    `;
    
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('component', JSON.stringify(component));
    });
    
    grid.appendChild(div);
  });
}

// Filter Components
function filterComponents(query) {
  const items = document.querySelectorAll('.component-item');
  const queryLower = query.toLowerCase();
  
  items.forEach(item => {
    const name = item.querySelector('.component-name').textContent.toLowerCase();
    if (name.includes(queryLower)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Canvas Operations
function setupCanvasDragDrop() {
  const canvas = document.getElementById('canvas-container');
  
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  
  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const componentData = JSON.parse(e.dataTransfer.getData('component'));
    addComponentToCanvas(componentData, e.clientX, e.clientY);
  });
}

function addComponentToCanvas(component, x, y) {
  const canvasRect = document.getElementById('canvas-container').getBoundingClientRect();
  const componentItem = {
    id: Math.random().toString(36),
    component: component,
    x: x - canvasRect.left,
    y: y - canvasRect.top
  };
  
  app.components.push(componentItem);
  renderCanvas();
}

function renderCanvas() {
  const svg = document.getElementById('canvas');
  svg.innerHTML = '';
  
  app.components.forEach((item, index) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${item.x}, ${item.y})`);
    
    // Component box
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '60');
    rect.setAttribute('height', '60');
    rect.setAttribute('fill', '#f0f0f0');
    rect.setAttribute('stroke', '#1e90ff');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '4');
    
    // Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '30');
    text.setAttribute('y', '35');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '20');
    text.textContent = item.component.icon;
    
    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  });
  
  document.getElementById('canvas-placeholder').style.display = 
    app.components.length > 0 ? 'none' : 'block';
}

function clearCanvas() {
  app.components = [];
  renderCanvas();
  document.getElementById('code-output').textContent = '// Select components to generate code';
}

// Code Generation
function generateCode() {
  if (app.components.length === 0) {
    alert('Please add components to the canvas first!');
    return;
  }
  
  let code = `// Circuito.io Clone - Auto Generated Code\n`;
  code += `// Generated: ${new Date().toLocaleDateString()}\n\n`;
  code += `// Pin definitions\n`;
  
  let pinNumber = 2;
  app.components.forEach((item) => {
    const comp = item.component;
    if (comp.id !== 'uno' && comp.id !== 'nano' && comp.id !== 'mega') {
      code += `const int ${comp.id}_PIN = ${pinNumber};\n`;
      pinNumber++;
    }
  });
  
  code += `\nvoid setup() {\n`;
  code += `  Serial.begin(9600);\n`;
  code += `  // Initialize pins\n`;
  
  app.components.forEach((item) => {
    const comp = item.component;
    if (['led', 'buzzer', 'dcmotor', 'servo'].includes(comp.id)) {
      code += `  pinMode(${comp.id}_PIN, OUTPUT);\n`;
    } else if (['button', 'photoresistor', 'temperature', 'pot'].includes(comp.id)) {
      code += `  pinMode(${comp.id}_PIN, INPUT);\n`;
    }
  });
  
  code += `}\n\nvoid loop() {\n`;
  code += `  // Add your code here\n`;
  code += `  delay(100);\n`;
  code += `}\n`;
  
  document.getElementById('code-output').textContent = code;
  switchTab('code');
}

function copyCode() {
  const code = document.getElementById('code-output').textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert('Code copied to clipboard!');
  });
}

// Tab Switching
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

function setupTabs() {
  setupCanvasDragDrop();
}

// Initialize on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
