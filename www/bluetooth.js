// Capacitor Bluetooth LE Plugin Integration
import { BluetoothLE } from '@capacitor-community/bluetooth-le';

// Initialize Bluetooth functionality
const initializeBluetooth = async () => {
  try {
    // Initialize the Bluetooth LE plugin
    await BluetoothLE.initialize({
      androidNeverForLocation: false,
    });
    
    console.log('Bluetooth initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Bluetooth:', error);
    return false;
  }
};

// Request Bluetooth permissions
const requestBluetoothPermissions = async () => {
  try {
    const permissionStatus = await BluetoothLE.requestPermissions();
    console.log('Bluetooth permission status:', permissionStatus);
    return permissionStatus;
  } catch (error) {
    console.error('Error requesting Bluetooth permissions:', error);
    return false;
  }
};

// Scan for Bluetooth devices
const scanForDevices = async () => {
  try {
    await BluetoothLE.startScan({
      services: [], // Empty array means scan for all services
      allowDuplicates: false,
    });
    
    // Set up listener for discovered devices
    BluetoothLE.addListener('onScanResult', (result) => {
      console.log('Discovered device:', result);
      // Here you would update your UI with the discovered device
    });
    
    // Stop scan after 10 seconds
    setTimeout(async () => {
      await BluetoothLE.stopScan();
      console.log('Scan stopped');
    }, 10000);
    
    return true;
  } catch (error) {
    console.error('Error scanning for devices:', error);
    return false;
  }
};

// Connect to a device
const connectToDevice = async (deviceId) => {
  try {
    const result = await BluetoothLE.connect({
      deviceId,
    });
    
    console.log('Connected to device:', result);
    return true;
  } catch (error) {
    console.error('Error connecting to device:', error);
    return false;
  }
};

// Disconnect from a device
const disconnectFromDevice = async (deviceId) => {
  try {
    await BluetoothLE.disconnect({
      deviceId,
    });
    
    console.log('Disconnected from device');
    return true;
  } catch (error) {
    console.error('Error disconnecting from device:', error);
    return false;
  }
};

// Export the functions
export {
  initializeBluetooth,
  requestBluetoothPermissions,
  scanForDevices,
  connectToDevice,
  disconnectFromDevice
};
