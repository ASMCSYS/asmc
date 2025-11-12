#!/bin/bash

echo "Starting ASMC Admin Build Process..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH"
    exit 1
fi

# Run the build script
echo "Running build script..."
node build.js

# Check if build was successful
if [ $? -eq 0 ]; then
    echo
    echo "Build completed successfully!"
    echo "Build output is in: asmc-admin-build"
else
    echo
    echo "Build failed with error code: $?"
fi 