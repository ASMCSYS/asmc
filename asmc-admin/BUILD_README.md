# ASMC Admin Build Script

This directory contains build scripts for the ASMC Admin application that will generate the build output in the `asmc-admin-build` folder.

## Files

- `build.js` - Main Node.js build script
- `build.bat` - Windows batch file for easy execution
- `build.sh` - Unix/Linux/macOS shell script for easy execution
- `BUILD_README.md` - This documentation file

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Usage

### Option 1: Using the build script directly (Cross-platform)

```bash
node build.js
```

### Option 2: Using the batch file (Windows)

```cmd
build.bat
```

### Option 3: Using the shell script (Unix/Linux/macOS)

```bash
chmod +x build.sh
./build.sh
```

## What the build script does

1. **Cleans** the existing `asmc-admin-build` directory
2. **Creates** the build directory if it doesn't exist
3. **Installs** dependencies if `node_modules` doesn't exist
4. **Builds** the React application using the build script from `package.json`
5. **Moves** the build output from the default `build` folder to `asmc-admin-build`
6. **Copies** static assets from the `public` directory
7. **Creates** a `build-info.json` file with build metadata

## Build Output

The build output will be generated in the `asmc-admin-build` directory with the following structure:

```
asmc-admin-build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── robots.txt
├── build-info.json
└── ... (other static assets)
```

## Build Information

The script creates a `build-info.json` file containing:
- Build timestamp
- Build script version
- Environment information
- Build script identifier

## Error Handling

The build script includes comprehensive error handling:
- Checks for Node.js and npm installation
- Validates package.json existence
- Handles build failures gracefully
- Provides clear error messages

## Troubleshooting

### Common Issues

1. **Node.js not found**: Install Node.js from https://nodejs.org/
2. **npm not found**: npm comes with Node.js, reinstall Node.js if needed
3. **Build script not found in package.json**: Ensure your package.json has a "build" script
4. **Permission denied**: On Unix systems, make the shell script executable with `chmod +x build.sh`

### Manual Build

If the automated build fails, you can manually run:

```bash
npm install
npm run build
```

Then manually copy the contents of the `build` folder to `asmc-admin-build`.

## Notes

- The build script automatically handles dependency installation
- The script cleans the build directory before each build
- Build output is optimized for production deployment
- Static assets are preserved and copied to the build directory 