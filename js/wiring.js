/**
 * SynthRobs Wiring System
 * Handles connections between circuit components
 * Includes validation, visualization, and management of wire connections
 */

const WiringSystem = (() => {
    let wires = [];
    let selectedWire = null;
    let isDrawingWire = false;
    let wireStartPoint = null;
    let wireStartComponent = null;
    let wireStartPin = null;

    // Wire color mapping based on function
    const WIRE_COLORS = {
        '5V': '#FF0000',      // Red for 5V
        '3.3V': '#FFA500',    // Orange for 3.3V
        'GND': '#000000',      // Black for Ground
        'Data': '#0000FF',     // Blue for Data
        'Power': '#FF0000',    // Red for Power
        'Signal': '#00AA00',   // Green for Signal
        'Default': '#808080'   // Gray for default
    };

    // Get wire color based on pin type
    function getWireColor(pinType) {
        return WIRE_COLORS[pinType] || WIRE_COLORS['Default'];
    }

    // Get pin position from canvas
    function getPinPosition(componentId, pinNumber) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!component) return null;

        const rect = component.getBoundingClientRect();
        const pinY = rect.top + (pinNumber * 15);
        const pinX = rect.right;

        return { x: pinX, y: pinY };
    }

    // Validate wire connection
    function validateConnection(sourceComponentId, sourcePinNumber, targetComponentId, targetPinNumber) {
        // Prevent self-connections
        if (sourceComponentId === targetComponentId) {
            console.warn('Cannot connect component to itself');
            return false;
        }

        // Check for duplicate connections
        const isDuplicate = wires.some(wire => 
            (wire.source.componentId === sourceComponentId && 
             wire.source.pin === sourcePinNumber &&
             wire.target.componentId === targetComponentId &&
             wire.target.pin === targetPinNumber) ||
            (wire.source.componentId === targetComponentId && 
             wire.source.pin === targetPinNumber &&
             wire.target.componentId === sourceComponentId &&
             wire.target.pin === sourcePinNumber)
        );

        if (isDuplicate) {
            console.warn('Connection already exists');
            return false;
        }

        // Check pin compatibility
        const sourceComp = getComponentById(sourceComponentId);
        const targetComp = getComponentById(targetComponentId);

        if (!sourceComp || !targetComp) return false;

        const sourcePin = sourceComp.pins[sourcePinNumber];
        const targetPin = targetComp.pins[targetPinNumber];

        if (!sourcePin || !targetPin) return false;

        // Validate pin types can connect
        const sourceType = sourcePin.type || 'Signal';
        const targetType = targetPin.type || 'Signal';

        // Simple validation: both should be compatible
        const compatibleTypes = {
            'Power': ['Ground', 'Signal'],
            'Ground': ['Power', 'Signal'],
            'Signal': ['Power', 'Ground', 'Signal'],
            'Data': ['Data', 'Signal']
        };

        if (compatibleTypes[sourceType] && !compatibleTypes[sourceType].includes(targetType)) {
            console.warn(`Pin types ${sourceType} and ${targetType} are incompatible`);
            return false;
        }

        return true;
    }

    // Create a wire connection
    function createWire(sourceComponentId, sourcePinNumber, targetComponentId, targetPinNumber, pinType = 'Signal') {
        if (!validateConnection(sourceComponentId, sourcePinNumber, targetComponentId, targetPinNumber)) {
            return null;
        }

        const wireId = `wire_${Date.now()}`;
        const wire = {
            id: wireId,
            source: { componentId: sourceComponentId, pin: sourcePinNumber },
            target: { componentId: targetComponentId, pin: targetPinNumber },
            type: pinType,
            color: getWireColor(pinType),
            thickness: 2,
            createdAt: new Date()
        };

        wires.push(wire);
        renderWire(wire);
        return wire;
    }

    // Delete a wire
    function deleteWire(wireId) {
        const index = wires.findIndex(w => w.id === wireId);
        if (index !== -1) {
            wires.splice(index, 1);
            const wireElement = document.getElementById(wireId);
            if (wireElement) wireElement.remove();
            return true;
        }
        return false;
    }

    // Render wire on canvas
    function renderWire(wire) {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;

        const sourcePos = getPinPosition(wire.source.componentId, wire.source.pin);
        const targetPos = getPinPosition(wire.target.componentId, wire.target.pin);

        if (!sourcePos || !targetPos) return;

        // Create SVG line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.id = wire.id;
        line.setAttribute('x1', sourcePos.x);
        line.setAttribute('y1', sourcePos.y);
        line.setAttribute('x2', targetPos.x);
        line.setAttribute('y2', targetPos.y);
        line.setAttribute('stroke', wire.color);
        line.setAttribute('stroke-width', wire.thickness);
        line.setAttribute('data-wire-id', wire.id);
        line.setAttribute('class', 'wire-connection');
        line.style.cursor = 'pointer';

        // Add click event for selection
        line.addEventListener('click', () => selectWire(wire.id));

        canvas.appendChild(line);
    }

    // Select a wire
    function selectWire(wireId) {
        // Deselect previous
        if (selectedWire) {
            const prevElement = document.getElementById(selectedWire);
            if (prevElement) prevElement.setAttribute('stroke-width', 2);
        }

        selectedWire = wireId;
        const wireElement = document.getElementById(wireId);
        if (wireElement) {
            wireElement.setAttribute('stroke-width', 4);
        }
    }

    // Deselect wire
    function deselectWire() {
        if (selectedWire) {
            const wireElement = document.getElementById(selectedWire);
            if (wireElement) wireElement.setAttribute('stroke-width', 2);
        }
        selectedWire = null;
    }

    // Get all wires
    function getAllWires() {
        return [...wires];
    }

    // Get wires connected to a component
    function getComponentWires(componentId) {
        return wires.filter(w => 
            w.source.componentId === componentId || 
            w.target.componentId === componentId
        );
    }

    // Delete all wires connected to a component
    function deleteComponentWires(componentId) {
        const componentWires = getComponentWires(componentId);
        componentWires.forEach(wire => deleteWire(wire.id));
    }

    // Clear all wires
    function clearAllWires() {
        wires.forEach(wire => {
            const wireElement = document.getElementById(wire.id);
            if (wireElement) wireElement.remove();
        });
        wires = [];
        selectedWire = null;
    }

    // Start drawing wire
    function startWireDrawing(componentId, pinNumber) {
        isDrawingWire = true;
        wireStartComponent = componentId;
        wireStartPin = pinNumber;
        wireStartPoint = getPinPosition(componentId, pinNumber);
    }

    // End wire drawing
    function endWireDrawing(targetComponentId, targetPinNumber) {
        if (!isDrawingWire) return null;

        isDrawingWire = false;
        const wire = createWire(
            wireStartComponent, 
            wireStartPin, 
            targetComponentId, 
            targetPinNumber, 
            'Signal'
        );

        wireStartComponent = null;
        wireStartPin = null;
        wireStartPoint = null;

        return wire;
    }

    // Get wire information
    function getWireInfo(wireId) {
        return wires.find(w => w.id === wireId);
    }

    // Update wire properties
    function updateWireProperties(wireId, properties) {
        const wire = wires.find(w => w.id === wireId);
        if (!wire) return false;

        Object.assign(wire, properties);
        
        // Update visual representation
        const wireElement = document.getElementById(wireId);
        if (wireElement) {
            if (properties.color) wireElement.setAttribute('stroke', properties.color);
            if (properties.thickness) wireElement.setAttribute('stroke-width', properties.thickness);
        }

        return true;
    }

    // Validate circuit (check for issues)
    function validateCircuit() {
        const issues = [];

        // Check for components without connections
        const components = document.querySelectorAll('[data-component-id]');
        components.forEach(comp => {
            const compId = comp.getAttribute('data-component-id');
            const compWires = getComponentWires(compId);
            
            if (compWires.length === 0) {
                issues.push({ type: 'warning', message: `Component ${compId} has no connections` });
            }
        });

        // Check for power supply
        const hasPowerSupply = wires.some(w => {
            const wire = wires.find(wire => wire.id === w.id);
            return wire && (wire.type === 'Power' || wire.type === '5V');
        });

        if (!hasPowerSupply && wires.length > 0) {
            issues.push({ type: 'warning', message: 'Circuit has no power supply connection' });
        }

        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }

    // Redraw all wires (useful for canvas updates)
    function redrawAllWires() {
        // Clear SVG wires
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const wireElements = canvas.querySelectorAll('[data-wire-id]');
            wireElements.forEach(el => el.remove());
        }

        // Redraw each wire
        wires.forEach(wire => renderWire(wire));
    }

    // Get wires data for export
    function exportWires() {
        return JSON.stringify(wires, null, 2);
    }

    // Import wires data
    function importWires(wiresData) {
        try {
            const importedWires = JSON.parse(wiresData);
            clearAllWires();
            
            importedWires.forEach(wireData => {
                const wire = Object.assign({}, wireData);
                wires.push(wire);
                renderWire(wire);
            });

            return true;
        } catch (error) {
            console.error('Failed to import wires:', error);
            return false;
        }
    }

    // Helper function to get component by ID (should be implemented in main.js)
    function getComponentById(componentId) {
        const element = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!element) return null;

        return {
            id: componentId,
            pins: parseInt(element.getAttribute('data-pins')) || 14
        };
    }

    // Public API
    return {
        createWire,
        deleteWire,
        deleteComponentWires,
        getAllWires,
        getComponentWires,
        clearAllWires,
        getWireInfo,
        updateWireProperties,
        selectWire,
        deselectWire,
        validateConnection,
        validateCircuit,
        startWireDrawing,
        endWireDrawing,
        redrawAllWires,
        exportWires,
        importWires
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WiringSystem;
}
