const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_OUTPUT_DIR = '../asmc-admin-build';
const SOURCE_DIR = './src';
const PUBLIC_DIR = './public';

console.log('🚀 Starting ASMC Admin Build Process...\n');

// Function to execute commands with error handling
function executeCommand(command, description) {
    console.log(`📋 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit', cwd: __dirname });
        console.log(`✅ ${description} completed successfully\n`);
    } catch (error) {
        console.error(`❌ Error during ${description}:`, error.message);
        process.exit(1);
    }
}

// Function to clean build directory
function cleanBuildDirectory() {
    console.log('🧹 Cleaning build directory...');
    const buildPath = path.resolve(__dirname, BUILD_OUTPUT_DIR);
    
    if (fs.existsSync(buildPath)) {
        try {
            fs.rmSync(buildPath, { recursive: true, force: true });
            console.log('✅ Build directory cleaned\n');
        } catch (error) {
            console.error('❌ Error cleaning build directory:', error.message);
            process.exit(1);
        }
    } else {
        console.log('ℹ️  Build directory does not exist, skipping cleanup\n');
    }
}

// Function to create build directory
function createBuildDirectory() {
    console.log('📁 Creating build directory...');
    const buildPath = path.resolve(__dirname, BUILD_OUTPUT_DIR);
    
    try {
        if (!fs.existsSync(buildPath)) {
            fs.mkdirSync(buildPath, { recursive: true });
        }
        console.log('✅ Build directory created\n');
    } catch (error) {
        console.error('❌ Error creating build directory:', error.message);
        process.exit(1);
    }
}

// Function to copy static assets
function copyStaticAssets() {
    console.log('📦 Copying static assets...');
    const publicPath = path.resolve(__dirname, PUBLIC_DIR);
    const buildPath = path.resolve(__dirname, BUILD_OUTPUT_DIR);
    
    if (fs.existsSync(publicPath)) {
        try {
            // Copy public directory contents
            execSync(`cp -r "${publicPath}"/* "${buildPath}/"`, { stdio: 'inherit' });
            console.log('✅ Static assets copied\n');
        } catch (error) {
            console.error('❌ Error copying static assets:', error.message);
            process.exit(1);
        }
    } else {
        console.log('ℹ️  Public directory not found, skipping static assets copy\n');
    }
}

// Function to build React application
function buildReactApp() {
    console.log('🔨 Building React application...');
    
    // Check if package.json exists
    const packageJsonPath = path.resolve(__dirname, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.error('❌ package.json not found in current directory');
        process.exit(1);
    }
    
    // Read package.json to check for build script
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.scripts && packageJson.scripts.build) {
            // Use npm build script
            executeCommand('npm run build', 'Building React application');
        } else {
            // Fallback: try to build manually
            console.log('⚠️  No build script found in package.json, attempting manual build...');
            
            // Install dependencies if node_modules doesn't exist
            if (!fs.existsSync(path.resolve(__dirname, 'node_modules'))) {
                executeCommand('npm install', 'Installing dependencies');
            }
            
            // Try to build using react-scripts
            try {
                executeCommand('npx react-scripts build', 'Building with react-scripts');
            } catch (error) {
                console.error('❌ Manual build failed. Please ensure you have a proper build script in package.json');
                process.exit(1);
            }
        }
    } catch (error) {
        console.error('❌ Error reading package.json:', error.message);
        process.exit(1);
    }
}

// Function to move build output
function moveBuildOutput() {
    console.log('📂 Moving build output...');
    const defaultBuildPath = path.resolve(__dirname, 'build');
    const targetBuildPath = path.resolve(__dirname, BUILD_OUTPUT_DIR);
    
    if (fs.existsSync(defaultBuildPath)) {
        try {
            // Move contents from default build folder to target folder
            execSync(`cp -r "${defaultBuildPath}"/* "${targetBuildPath}/"`, { stdio: 'inherit' });
            
            // Remove the default build folder
            fs.rmSync(defaultBuildPath, { recursive: true, force: true });
            
            console.log('✅ Build output moved successfully\n');
        } catch (error) {
            console.error('❌ Error moving build output:', error.message);
            process.exit(1);
        }
    } else {
        console.log('ℹ️  Default build folder not found, build may have already been output to target directory\n');
    }
}

// Function to create build info
function createBuildInfo() {
    console.log('📝 Creating build information...');
    const buildPath = path.resolve(__dirname, BUILD_OUTPUT_DIR);
    const buildInfo = {
        buildTime: new Date().toISOString(),
        buildScript: 'build.js',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production'
    };
    
    try {
        fs.writeFileSync(
            path.join(buildPath, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        );
        console.log('✅ Build information created\n');
    } catch (error) {
        console.error('❌ Error creating build info:', error.message);
    }
}

// Main build process
async function main() {
    try {
        // Step 1: Clean build directory
        cleanBuildDirectory();
        
        // Step 2: Create build directory
        createBuildDirectory();
        
        // Step 3: Install dependencies if needed
        if (!fs.existsSync(path.resolve(__dirname, 'node_modules'))) {
            executeCommand('npm install', 'Installing dependencies');
        }
        
        // Step 4: Build React application
        buildReactApp();
        
        // Step 5: Move build output to target directory
        moveBuildOutput();
        
        // Step 6: Copy static assets
        copyStaticAssets();
        
        // Step 7: Create build info
        createBuildInfo();
        
        console.log('🎉 Build completed successfully!');
        console.log(`📁 Build output: ${path.resolve(__dirname, BUILD_OUTPUT_DIR)}`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Run the build process
main(); 