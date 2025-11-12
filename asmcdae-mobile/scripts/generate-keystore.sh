#!/bin/bash

# ASMCDAE Keystore Generation Script

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

KEYSTORE_DIR="android/app"
KEYSTORE_TYPE="PKCS12"
KEY_ALGORITHM="RSA"
VALIDITY_DAYS="10000"


generate_production_keystore() {
  local keystore_file="$KEYSTORE_DIR/asmcdae-production.keystore"
  local alias="asmcdae-production-key"
  local key_size="4096"
  local password="${KEYSTORE_PASSWORD:-Asmcdae2025Production!}"  # Default password for CI/demo
  local company="${COMPANY_NAME:-ASMCDAE}"
  local city="${CITY:-Dubai}"
  local state="${STATE:-Dubai}"
  local country="${COUNTRY_CODE:-AE}"

  log "Generating production keystore..."
  [ -f "$keystore_file" ] && error "Production keystore already exists: $keystore_file"

  # Use environment variables if available, otherwise prompt interactively
  if [ -z "$KEYSTORE_PASSWORD" ] && [ -t 0 ]; then
    echo -n "Enter production keystore password (12+ chars): "
    read -s password; echo
    [ ${#password} -lt 12 ] && error "Password too short"
    echo -n "Confirm password: "; read -s confirm; echo
    [ "$password" != "$confirm" ] && error "Passwords do not match"
    
    echo -n "Company name: "; read company
    echo -n "City: "; read city  
    echo -n "State: "; read state
    echo -n "Country code (e.g., AE): "; read country
  else
    log "Using environment variables for keystore generation"
  fi

  mkdir -p "$KEYSTORE_DIR"
  keytool -genkeypair -v \
    -storetype "$KEYSTORE_TYPE" \
    -keystore "$keystore_file" \
    -alias "$alias" \
    -keyalg "$KEY_ALGORITHM" \
    -keysize "$key_size" \
    -validity "$VALIDITY_DAYS" \
    -storepass "$password" \
    -keypass "$password" \
    -dname "CN=$company, OU=Mobile Development, O=$company, L=$city, S=$state, C=$country"

  success "Production keystore generated: $keystore_file"
  success "Alias: $alias"
  success "Password: $password"
  warning "Backup your production keystore securely and store the password safely!"
}

case "${1:-help}" in
  production) generate_production_keystore ;;
  *)
    echo "Usage: $0 production"
    echo "Generates production keystore for release builds"
    ;;
esac


