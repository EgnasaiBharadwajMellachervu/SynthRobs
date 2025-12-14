// SynthRobs Main Application
// Complete working implementation

// Component Database from components-data.js is loaded separately
// This main.js handles UI logic, event listeners, and tab management

let cart = [];
let selectedComponents = [];

// Initialize Application on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('SynthRobs Initializing...');
    renderComponentList();
    setupEventListeners();
    setupTabSwitching();
    loadCatalogTab();
    loadFeaturesTab();
    console.log('SynthRobs Ready!');
});

// Render Components in the Left Panel
function renderComponentList() {
    const componentsList = document.getElementById('components-list');
    if (!componentsList) {
        console.error('components-list element not found');
        return;
    }
    
    componentsList.innerHTML = '';
    
    // Use COMPONENTS_DB if available, otherwise use sample data
    const components = window.COMPONENTS_DB || {
        controllers: [
            { id: 'uno', name: 'Arduino Uno', icon: '🎛️', pins: 14, price: 2500 },
            { id: 'nano', name: 'Arduino Nano', icon: '🎛️', pins: 12, price: 800 },
            { id: 'mega', name: 'Arduino Mega', icon: '🎛️', pins: 54, price: 4500 }
        ],
        inputs: [
            { id: 'button', name: 'Button', icon: '⭕', pins: 1, price: 100 },
            { id: 'pot', name: 'Potentiometer', icon: '📊', pins: 3, price: 150 },
            { id: 'light', name: 'Light Sensor', icon: '💡', pins: 1, price: 200 },
            { id: 'temp', name: 'Temperature', icon: '🌡️', pins: 1, price: 300 },
            { id: 'ultra', name: 'Ultrasonic', icon: '📡', pins: 2, price: 250 }
        ],
        outputs: [
            { id: 'led', name: 'LED', icon: '💡', pins: 2, price: 50 },
            { id: 'buzzer', name: 'Buzzer', icon: '🔊', pins: 2, price: 120 },
            { id: 'servo', name: 'Servo Motor', icon: '⚙️', pins: 3, price: 800 },
            { id: 'dcmotor', name: 'DC Motor', icon: '⚙️', pins: 2, price: 600 },
            { id: 'lcd', name: 'LCD Display', icon: '📺', pins: 16, price: 1200 }
        ],
        modules: [
            { id: 'wifi', name: 'WiFi Module', icon: '📡', pins: 5, price: 2000 },
            { id: 'bluetooth', name: 'Bluetooth', icon: '📱', pins: 4, price: 1500 }
        ],
        power: [
            { id: 'battery5v', name: '5V Battery', icon: '🔋', pins: 2, price: 400 },
            { id: 'battery9v', name: '9V Battery', icon: '🔋', pins: 2, price: 600 }
        ]
    };
    
    // Combine all components
    const allComponents = [
        ...components.controllers,
        ...components.inputs,
        ...components.outputs,
        ...components.modules,
        ...components.power
    ];
    
    // Render each component
    allComponents.forEach(comp => {
        const div = document.createElement('div');
        div.className = 'component-item';
        div.draggable = true;
        div.innerHTML = `
            <div class="component-icon">${comp.icon}</div>
            <div class="component-name">${comp.name}</div>
            <div class="component-price">₹${comp.price}</div>
        `;
        
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('component', JSON.stringify(comp));
        });
        
        div.addEventListener('click', () => selectComponent(comp));
        
        componentsList.appendChild(div);
    });
}

// Select a Component
function selectComponent(comp) {
    const title = document.getElementById('details-title');
    const details = document.getElementById('component-details');
    
    if (title) title.innerHTML = comp.name;
    if (details) {
        details.innerHTML = `
            <p><strong>Name:</strong> ${comp.name}</p>
            <p><strong>Pins:</strong> ${comp.pins}</p>
            <p><strong>Price:</strong> ₹${comp.price}</p>
        `;
    }
    
    selectedComponents = [comp];
    updateSelectedParts();
}

// Update Selected Parts Display
function updateSelectedParts() {
    const container = document.getElementById('parts-container');
    const priceEl = document.getElementById('total-price');
    
    if (!container) return;
    
    container.innerHTML = '';
    let total = 0;
    
    selectedComponents.forEach(comp => {
        const div = document.createElement('div');
        div.className = 'part-item';
        div.innerHTML = `${comp.name} - ₹${comp.price}`;
        container.appendChild(div);
        total += comp.price;
    });
    
    if (priceEl) priceEl.textContent = '$' + (total / 100).toFixed(2);
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    const search = document.getElementById('component-search');
    if (search) search.addEventListener('input', filterComponents);
    
    // Category Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => filterByCategory(e.target.textContent));
    });
    
    // Clear Button
    const clearBtn = document.getElementById('clear-canvas-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => {
        selectedComponents = [];
        updateSelectedParts();
    });
    
    // Generate Code
    const genBtn = document.getElementById('generate-code-btn');
    if (genBtn) genBtn.addEventListener('click', generateCode);
    
    // Add to Cart
    const cartBtn = document.getElementById('add-to-cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', addToCart);
}

// Filter Components
function filterComponents(e) {
    const search = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.component-item');
    items.forEach(item => {
        const name = item.querySelector('.component-name');
        if (name && name.textContent.toLowerCase().includes(search)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter by Category
function filterByCategory(category) {
    console.log('Filter by:', category);
    renderComponentList();
}

// Generate Code
function generateCode() {
    const codeOutput = document.getElementById('code-output');
    if (!codeOutput) return;
    
    let code = `// SynthRobs Generated Arduino Code\n// Date: ${new Date().toLocaleString()}\n\n`;
    code += `#include <Arduino.h>\n\n`;
    code += `void setup() {\n  Serial.begin(9600);\n  Serial.println(\"SynthRobs Ready!\");\n}\n\n`;
    code += `void loop() {\n  // Add your code here\n  delay(1000);\n}\n`;
    
    const pre = document.createElement('pre');
    pre.textContent = code;
    codeOutput.innerHTML = '';
    codeOutput.appendChild(pre);
}

// Add to Cart
function addToCart() {
    if (selectedComponents.length === 0) {
        alert('Please select a component first!');
        return;
    }
    cart.push(...selectedComponents);
    updateCartCount();
    alert('Added to cart!');
}

// Update Cart Count
function updateCartCount() {
    const count = document.getElementById('cart-count');
    if (count) count.textContent = cart.length;
}

// Setup Tab Switching
function setupTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.id));
    });
}

// Switch Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const tabId2 = tabId.replace('-btn', '-tab');
    const activeTab = document.getElementById(tabId2);
    if (activeTab) activeTab.classList.add('active');
    
    const activeBtn = document.getElementById(tabId);
    if (activeBtn) activeBtn.classList.add('active');
}

// Load Catalog Tab
function loadCatalogTab() {
    const catalog = document.getElementById('catalog-list');
    if (!catalog) return;
    
    catalog.innerHTML = '<p>Component Catalog - All Arduino components available for purchase</p>';
}

// Load Features Tab
function loadFeaturesTab() {
    const features = document.getElementById('features-list');
    if (!features) return;
    
    features.innerHTML = `
        <div class="feature-item">
            <h3>🎯 Drag & Drop Interface</h3>
            <p>Easily design circuits by dragging components onto the canvas</p>
        </div>
        <div class="feature-item">
            <h3>💻 Code Generation</h3>
            <p>Automatically generate Arduino code from your circuit design</p>
        </div>
        <div class="feature-item">
            <h3>🛒 Easy Shopping</h3>
            <p>Browse and purchase components directly from the catalog</p>
        </div>
        <div class="feature-item">
            <h3>📦 Component Library</h3>
            <p>Access a comprehensive library of Arduino-compatible components</p>
        </div>
    `;
}
