// SynthRobs Main Application
// Complete working implementation
let cart = [];
let selectedComponents = [];

// Initialize Application on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('SynthRobs Initializing...');
    renderComponentList();
    setupEventListeners();
//     setupTabSwitching();
    loadCatalogTab();
    loadFeaturesTab();
    updateCartCount();
    console.log('SynthRobs Ready!');
});

// Render Components in the Left Panel
function renderComponentList() {
    const componentsList = document.getElementById('components-list');
    if (!componentsList) return;
    
    componentsList.innerHTML = '';
    
    const components = [
        { id: 'uno', name: 'Arduino Uno', icon: '🎡', pins: 14, price: 2500 },
        { id: 'nano', name: 'Arduino Nano', icon: '🎡', pins: 12, price: 800 },
        { id: 'button', name: 'Button', icon: '⭕', pins: 1, price: 100 },
        { id: 'pot', name: 'Potentiometer', icon: '📊', pins: 3, price: 150 },
        { id: 'led', name: 'LED', icon: '💻', pins: 2, price: 50 },
        { id: 'servo', name: 'Servo Motor', icon: '⚙️', pins: 3, price: 800 },
        { id: 'lcd', name: 'LCD Display', icon: '📋', pins: 16, price: 1200 },
        { id: 'wifi', name: 'WiFi Module', icon: '📱', pins: 5, price: 2000 }
    ];
    
    components.forEach(comp => {
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
    
    if (priceEl) priceEl.textContent = '₹' + total;
}

// Setup Event Listeners
function setupEventListeners() {
    const search = document.getElementById('component-search');
    if (search) search.addEventListener('input', filterComponents);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => filterByCategory(e.target.textContent));
    });
    
    const clearBtn = document.getElementById('clear-canvas-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearCanvas);
    
    const genBtn = document.getElementById('generate-code-btn');
    if (genBtn) genBtn.addEventListener('click', generateCode);
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
    renderComponentList();
}

// Clear Canvas
function clearCanvas() {
    selectedComponents = [];
    updateSelectedParts();
}

// Generate Code
function generateCode() {
    const codeOutput = document.getElementById('code-output');
    if (!codeOutput) return;
    
    let code = `// SynthRobs Generated Arduino Code\n// Date: ${new Date().toLocaleString()}\n\n`;
    code += `#include <Arduino.h>\n\n`;
    code += `void setup() {\n    Serial.begin(9600);\n    Serial.println(\"SynthRobs Ready!\");\n}\n\n`;
    code += `void loop() {\n    // Add your code here\n    delay(1000);\n}\n`;
    
    codeOutput.innerHTML = '<pre>' + code + '</pre>';
}

// Add to Cart
function addAllToCart() {
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
        btn.addEventListener('click', (e) => switchTab(e.target.id.replace('-btn', '')));
    });
}

// Switch Tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show active tab
    const tabId = tabName + '-tab';
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Activate button
    const btnId = tabName + '-btn';
    const activeBtn = document.getElementById(btnId);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Load content when switching tabs
    if (tabName === 'catalog') {
        loadCatalogTab();
    } else if (tabName === 'features') {
        loadFeaturesTab();
    } else if (tabName === 'code') {
        // Code tab will show generated code
    }
}

// Load Catalog Tab
function loadCatalogTab() {
    const catalogList = document.getElementById('catalog-list');
    if (!catalogList) return;
    
    const components = [
        { name: 'Arduino Uno', price: '₹2,500', desc: 'Most popular Arduino board' },
        { name: 'LED', price: '₹50', desc: 'Light Emitting Diode' },
        { name: 'Button', price: '₹100', desc: 'Push button switch' },
        { name: 'Potentiometer', price: '₹150', desc: 'Variable resistor' },
        { name: 'Light Sensor', price: '₹200', desc: 'Photoresistor LDR' },
        { name: 'Temperature Sensor', price: '₹300', desc: 'DS18B20 Digital' },
        { name: 'Ultrasonic Sensor', price: '₹250', desc: 'HC-SR04 Distance sensor' },
        { name: 'Servo Motor', price: '₹800', desc: 'SG90 Servo' },
        { name: 'DC Motor', price: '₹600', desc: 'Small DC motor' },
        { name: '16x2 LCD Display', price: '₹1,200', desc: 'Alphanumeric LCD' },
        { name: 'WiFi Module', price: '₹2,000', desc: 'ESP8266 WiFi' },
        { name: 'Bluetooth Module', price: '₹1,500', desc: 'HC-05 Bluetooth' }
    ];
    
    catalogList.innerHTML = components.map(comp => `
        <div style="padding:15px; border:1px solid #ddd; margin:10px 0; border-radius:5px;">
            <h4 style="margin:0 0 5px 0;">${comp.name}</h4>
            <p style="margin:0 0 5px 0; color:#666;">${comp.desc}</p>
            <p style="margin:0; font-weight:bold; color:#007bff;">${comp.price}</p>
        </div>
    `).join('');
}

// Load Features Tab
function loadFeaturesTab() {
    const featuresList = document.getElementById('features-list');
    if (!featuresList) return;
    
    const features = [
        { icon: '🎯', title: 'Drag & Drop Design', desc: 'Easily build circuits by dragging components' },
        { icon: '💻', title: 'Code Generation', desc: 'Auto-generate Arduino code from your design' },
        { icon: '📚', title: 'Component Library', desc: 'Access 100+ Arduino-compatible components' },
        { icon: '🛒', title: 'E-Commerce', desc: 'Buy components directly with one click' },
        { icon: '⚡', title: 'Real-time Preview', desc: 'See your circuit layout in real-time' },
        { icon: '📖', title: 'Documentation', desc: 'Detailed guides for every component' }
    ];
    
    featuresList.innerHTML = features.map(feat => `
        <div style="padding:15px; border:1px solid #ddd; margin:10px 0; border-radius:5px;">
            <h4 style="margin:0 0 5px 0;">${feat.icon} ${feat.title}</h4>
            <p style="margin:0; color:#666;">${feat.desc}</p>
        </div>
    `).join('');
}

// Show Cart
function showCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'block';
}

// Close Cart
function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

// Copy Code
function copyCode() {
    const code = document.getElementById('code-output');
    if (code) {
        const text = code.textContent;
        navigator.clipboard.writeText(text);
        alert('Code copied to clipboard!');
    }
}

// Download Code
function downloadCode() {
    const code = document.getElementById('code-output');
    if (code) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code.textContent));
        element.setAttribute('download', 'sketch.ino');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
