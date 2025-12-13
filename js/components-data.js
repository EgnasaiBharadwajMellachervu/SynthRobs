// Comprehensive Arduino Components Database with Prices in INR
const COMPONENTS_DATABASE = {
  controllers: [
    { id: 'uno', name: 'Arduino Uno R3', icon: '🎛️', price: 499, description: '16MHz, 14 Digital, 6 Analog Pins' },
    { id: 'nano', name: 'Arduino Nano', icon: '🎛️', price: 349, description: 'Compact 16MHz controller' },
    { id: 'mega', name: 'Arduino Mega 2560', icon: '🎛️', price: 799, description: '54 Digital, 16 Analog Pins' },
    { id: 'pro_mini', name: 'Arduino Pro Mini', icon: '🎛️', price: 249, description: '5V/16MHz version' },
  ],
  sensors: [
    { id: 'dht11', name: 'DHT11 Temp/Humidity', icon: '🌡️', price: 149, description: 'Temp & Humidity Sensor' },
    { id: 'dht22', name: 'DHT22 Sensor', icon: '🌡️', price: 299, description: 'High precision sensor' },
    { id: 'ldr', name: 'LDR (Light Sensor)', icon: '💡', price: 29, description: 'Light dependent resistor' },
    { id: 'ultrasonic', name: 'HC-SR04 Ultrasonic', icon: '📏', price: 179, description: 'Distance measurement' },
    { id: 'motion', name: 'PIR Motion Sensor', icon: '👁️', price: 179, description: 'Motion detection' },
    { id: 'soil', name: 'Soil Moisture', icon: '🌱', price: 99, description: 'Soil moisture sensor' },
    { id: 'mq2', name: 'MQ2 Gas Sensor', icon: '💨', price: 199, description: 'Smoke & gas detection' },
    { id: 'mq5', name: 'MQ5 Gas Sensor', icon: '💨', price: 199, description: 'LPG detection' },
  ],
  actuators: [
    { id: 'led', name: 'LED (3mm)', icon: '💡', price: 5, description: 'Red LED' },
    { id: 'rgb_led', name: 'RGB LED', icon: '🌈', price: 15, description: 'Common cathode RGB' },
    { id: 'buzzer', name: 'Piezo Buzzer', icon: '🔔', price: 29, description: '5V passive buzzer' },
    { id: 'servo', name: 'SG90 Servo', icon: '⚙️', price: 179, description: '9g Servo Motor' },
    { id: 'motor_dc', name: 'DC Motor 3-6V', icon: '⚙️', price: 89, description: 'Small DC motor' },
    { id: 'motor_stepper', name: 'Stepper Motor', icon: '⚙️', price: 299, description: 'NEMA 17' },
    { id: 'relay', name: 'Relay Module', icon: '🔌', price: 129, description: '5V single channel' },
    { id: 'solenoid', name: 'Solenoid', icon: '⚡', price: 149, description: '12V solenoid valve' },
  ],
  passive: [
    { id: 'resistor_220', name: 'Resistor 220Ω', icon: '〰️', price: 1, description: 'Carbon film' },
    { id: 'resistor_1k', name: 'Resistor 1kΩ', icon: '〰️', price: 1, description: 'Carbon film' },
    { id: 'resistor_10k', name: 'Resistor 10kΩ', icon: '〰️', price: 1, description: 'Carbon film' },
    { id: 'capacitor_10u', name: 'Capacitor 10µF', icon: '◾', price: 2, description: 'Electrolytic' },
    { id: 'capacitor_100u', name: 'Capacitor 100µF', icon: '◾', price: 3, description: 'Electrolytic' },
    { id: 'diode_1n4007', name: 'Diode 1N4007', icon: '▶️', price: 2, description: 'Rectifier diode' },
    { id: 'button', name: 'Push Button', icon: '🔘', price: 5, description: 'Momentary switch' },
    { id: 'switch', name: 'Toggle Switch', icon: '🔘', price: 15, description: 'ON/OFF switch' },
  ],
  modules: [
    { id: 'lcd_16x2', name: '16x2 LCD Display', icon: '📺', price: 199, description: 'Blue/Green display' },
    { id: 'oled_128x64', name: 'OLED 128x64', icon: '📺', price: 349, description: '0.96 inch display' },
    { id: 'wifi_esp8266', name: 'ESP8266 WiFi', icon: '📡', price: 449, description: 'NodeMCU board' },
    { id: 'bluetooth_hc05', name: 'HC-05 Bluetooth', icon: '📡', price: 379, description: 'Wireless module' },
    { id: 'rfid_reader', name: 'RFID Reader', icon: '📋', price: 599, description: 'RC522 module' },
    { id: 'sd_card', name: 'SD Card Module', icon: '💾', price: 149, description: 'Data logging' },
    { id: 'rtc_ds3231', name: 'RTC DS3231', icon: '⏰', price: 179, description: 'Real time clock' },
    { id: 'motor_driver_l298n', name: 'L298N Motor Driver', icon: '🔧', price: 149, description: 'Dual motor control' },
  ],
  power: [
    { id: 'battery_9v', name: '9V Battery', icon: '🔋', price: 49, description: 'Alkaline battery' },
    { id: 'battery_aa', name: 'AA Battery', icon: '🔋', price: 15, description: 'Alkaline' },
    { id: 'usb_cable', name: 'USB Cable', icon: '🔌', price: 79, description: 'USB-B for Arduino' },
    { id: 'power_supply_5v', name: '5V Power Supply', icon: '⚡', price: 299, description: '2A adapter' },
  ]
};

// Circuit Configuration Templates
const CIRCUIT_TEMPLATES = {
  'blink_led': {
    name: 'Blink LED',
    components: ['led', 'resistor_220'],
    connections: 'Pin 13 -> LED Anode, LED Cathode -> GND through 220Ω',
    code: `void setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`
  },
  'temp_monitoring': {
    name: 'Temperature Monitor',
    components: ['dht22', 'lcd_16x2'],
    connections: 'DHT22 Pin -> Digital pin, LCD via I2C',
    code: `#include "DHT.h"\nDHT dht(2, DHT22);\nvoid setup() {\n  dht.begin();\n}\nvoid loop() {\n  float temp = dht.readTemperature();\n  // Display on LCD\n}`
  },
  'distance_alarm': {
    name: 'Ultrasonic Alarm',
    components: ['ultrasonic', 'buzzer', 'relay'],
    connections: 'HC-SR04 trigger->pin 8, echo->pin 9, Buzzer->pin 10',
    code: `const int trigPin = 8, echoPin = 9, buzzerPin = 10;\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  pinMode(buzzerPin, OUTPUT);\n}`
  }
};

// Shipping rates for Indian states
const SHIPPING_RATES = {
  'AP': 80,
  'TG': 80,
  'KA': 100,
  'TN': 100,
  'MH': 120,
  'DL': 120,
  'UP': 140
};

// Features list
const APP_FEATURES = [
  '✅ Drag-and-drop circuit design',
  '✅ 60+ Arduino components',
  '✅ Automatic code generation',
  '✅ Indian e-commerce store',
  '✅ Secure Razorpay payment',
  '✅ Delivery across India',
  '✅ Component catalog',
  '✅ Circuit templates',
  '✅ Pin configuration guide',
  '✅ Shopping cart',
  '✅ Address management',
  '✅ Order tracking',
  '✅ Multiple payment methods',
  '✅ Free shipping above ₹2000',
  '✅ Technical support',
  '✅ Competitive pricing'
];

window.COMPONENTS_DB = COMPONENTS_DATABASE;
window.CIRCUIT_TEMPLATES = CIRCUIT_TEMPLATES;
window.SHIPPING_RATES = SHIPPING_RATES;
window.APP_FEATURES = APP_FEATURES;
