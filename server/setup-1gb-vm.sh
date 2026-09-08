#!/usr/bin/env bash
# ==============================================================================
# Axiogen WhatsApp SaaS Engine — 1GB RAM / 1-Core Always Free VM Setup Script
# Configures 5GB Swap, V8 memory tuning, systemd service, and Node.js 20 LTS
# ==============================================================================

set -euo pipefail

echo "================================================================"
echo "  Setting up Axiogen WhatsApp SaaS on 1GB RAM Instance"
echo "================================================================"

# 1. Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run as root (e.g. sudo bash setup-1gb-vm.sh)"
  exit 1
fi

# 2. Configure 5GB Swapfile if not already present
SWAP_FILE="/swapfile"
SWAP_SIZE_GB=5

if swapon --show | grep -q "$SWAP_FILE"; then
  echo "--> 5GB Swapfile is already active. Skipping creation."
else
  echo "--> Creating ${SWAP_SIZE_GB}GB Swapfile at ${SWAP_FILE}..."
  if [ ! -f "$SWAP_FILE" ]; then
    fallocate -l "${SWAP_SIZE_GB}G" "$SWAP_FILE" || dd if=/dev/zero of="$SWAP_FILE" bs=1M count=$((SWAP_SIZE_GB * 1024))
    chmod 600 "$SWAP_FILE"
    mkswap "$SWAP_FILE"
  fi
  swapon "$SWAP_FILE"
  
  # Persist to /etc/fstab if not present
  if ! grep -q "$SWAP_FILE" /etc/fstab; then
    echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab
    echo "--> Added swapfile to /etc/fstab for reboot persistence."
  fi
  echo "--> 5GB Swapfile successfully configured and enabled!"
fi

# 3. Optimize Linux Virtual Memory Kernel Parameters for 1GB RAM
echo "--> Optimizing kernel swappiness and memory pressure..."
sysctl -w vm.swappiness=15
sysctl -w vm.vfs_cache_pressure=50
sysctl -w vm.overcommit_memory=1

# Persist sysctl settings
cat << 'EOF' > /etc/sysctl.d/99-axiogen-memory.conf
vm.swappiness = 15
vm.vfs_cache_pressure = 50
vm.overcommit_memory = 1
EOF

# 4. Install Node.js 20 LTS & Build Essentials if missing
if ! command -v node &> /dev/null; then
  echo "--> Installing Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs build-essential git
fi

NODE_VER=$(node -v)
echo "--> Node.js version: ${NODE_VER}"

# 5. Display Memory & Swap Summary
echo ""
echo "================================================================"
echo "  SYSTEM MEMORY CONFIGURATION"
echo "================================================================"
free -h
echo "================================================================"
echo "  Setup Complete! System is ready to run multi-tenant WhatsApp."
echo "================================================================"
