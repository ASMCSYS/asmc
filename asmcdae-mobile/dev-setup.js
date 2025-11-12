#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ASMC Mobile Development Environment...\n');

// Check if Android SDK is available
try {
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (!androidHome) {
    console.log('⚠️  Warning: ANDROID_HOME or ANDROID_SDK_ROOT not set');
    console.log(
      '   Please set your Android SDK path in environment variables\n',
    );
  } else {
    console.log('✅ Android SDK found at:', androidHome);
  }
} catch (error) {
  console.log('❌ Error checking Android SDK:', error.message);
}

// Check if adb is available
try {
  execSync('adb version', {stdio: 'pipe'});
  console.log('✅ ADB is available');
} catch (error) {
  console.log('❌ ADB not found. Please install Android SDK Platform Tools');
}

// Check if emulator is running
try {
  const devices = execSync('adb devices', {encoding: 'utf8'});
  const lines = devices.split('\n').filter(line => line.trim());
  const deviceCount = lines.length - 1; // Subtract header line

  if (deviceCount > 0) {
    console.log('✅ Android device/emulator connected');
    console.log('   Devices:', deviceCount);
  } else {
    console.log('⚠️  No Android devices connected');
    console.log('   Please start an emulator or connect a device');
  }
} catch (error) {
  console.log('❌ Error checking devices:', error.message);
}

// Set up port forwarding for development
try {
  execSync('adb reverse tcp:8081 tcp:8081');
  execSync('adb reverse tcp:8097 tcp:8097');
  console.log('✅ Port forwarding configured (8081, 8097)');
} catch (error) {
  console.log('❌ Error setting up port forwarding:', error.message);
}

console.log('\n📱 Development Environment Setup Complete!');
console.log('\nAvailable commands:');
console.log('  npm run start        - Start Metro bundler');
console.log('  npm run android      - Run on Android');
console.log('  npm run debug        - Start with cache reset and run Android');
console.log('  npm run start:reset  - Start Metro with cache reset');
console.log('\n🔧 Developer Tools:');
console.log(
  '  - React Native Debugger: Install from https://github.com/jhen0409/react-native-debugger',
);
console.log(
  '  - React DevTools: Available in browser at http://localhost:8097',
);
console.log('  - Flipper: Disabled (can be enabled in react-native.config.js)');
console.log('\n🐛 Debugging:');
console.log(
  '  - Shake device or press Cmd+M (Mac) / Ctrl+M (Windows) to open dev menu',
);
console.log('  - Enable "Debug JS Remotely" for React DevTools');
console.log('  - Use console.log statements (already configured in the app)');
console.log('\n🚀 Ready to develop! Run: npm run debug');
