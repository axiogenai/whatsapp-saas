#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo "  Deploying Axiogen WhatsApp SaaS on New VM"
echo "=================================================="

# 1. Run 1GB setup (5GB swap, memory tuning, Node.js)
sudo bash setup-1gb-vm.sh

# 2. Install dependencies & build
npm install
npm run build

# 3. Setup systemd service
sudo cp axiogen-whatsapp-saas.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable axiogen-whatsapp-saas
sudo systemctl restart axiogen-whatsapp-saas

echo "=================================================="
echo "  SUCCESS! Multi-Tenant SaaS Gateway is LIVE"
echo "  Check status: sudo systemctl status axiogen-whatsapp-saas"
echo "=================================================="
