#!/bin/bash

# ASMCDAE Android Release Build Script
# Builds signed release APK and AAB for manual Play Store upload

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

APP_NAME="ASMCDAE"
VERSION_NAME="${VERSION_NAME:-1.0.0}"
BUILD_TYPE="release"
OUTPUT_DIR="android/app/build/outputs/apk/release"
BUNDLE_OUTPUT_DIR="android/app/build/outputs/bundle/release"

log "Starting ${APP_NAME} Android release build..."

if [ ! -f "package.json" ] || [ ! -d "android" ]; then
  error "Please run this script from the asmcdae-mobile root directory"
fi

if [ ! -f "android/app/asmcdae-production.keystore" ] && [ ! -f "android/app/release.keystore" ]; then
  error "Production release keystore not found in android/app/. Please generate one with: bash scripts/generate-keystore.sh production"
fi

log "Cleaning previous builds..."
pushd android >/dev/null
./gradlew clean
popd >/dev/null

log "Installing dependencies..."
npm ci || npm ci --legacy-peer-deps || npm install --legacy-peer-deps

log "Building release APK..."
pushd android >/dev/null
./gradlew assembleRelease
popd >/dev/null

if [ -f "$OUTPUT_DIR/app-release.apk" ]; then
  success "Release APK built successfully!"
  APK_SIZE=$(du -h "$OUTPUT_DIR/app-release.apk" | cut -f1)
  log "APK size: $APK_SIZE"

  RELEASE_DIR="releases/$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$RELEASE_DIR"
  cp "$OUTPUT_DIR/app-release.apk" "$RELEASE_DIR/${APP_NAME}-v$VERSION_NAME-$(date +%Y%m%d).apk"
  success "Release APK saved to: $RELEASE_DIR/${APP_NAME}-v$VERSION_NAME-$(date +%Y%m%d).apk"

  log "Building Android App Bundle (AAB)..."
  pushd android >/dev/null
  ./gradlew bundleRelease
  popd >/dev/null

  if [ -f "$BUNDLE_OUTPUT_DIR/app-release.aab" ]; then
    cp "$BUNDLE_OUTPUT_DIR/app-release.aab" "$RELEASE_DIR/${APP_NAME}-v$VERSION_NAME-$(date +%Y%m%d).aab"
    success "Android App Bundle saved to: $RELEASE_DIR/${APP_NAME}-v$VERSION_NAME-$(date +%Y%m%d).aab"
  fi

  log "Build Summary:"
  log "- APK: $RELEASE_DIR/${APP_NAME}-v$VERSION_NAME-$(date +%Y%m%d).apk"
  log "- AAB: $RELEASE_DIR/${APP_NAME}-v$VERSION_NAME-$(date +%Y%m%d).aab"
  log "- Build Type: $BUILD_TYPE"
  log "- Version: $VERSION_NAME"
  log "- Date: $(date)"
else
  error "Failed to build release APK"
fi

success "${APP_NAME} Android release build completed!"


