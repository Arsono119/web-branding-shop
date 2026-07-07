#!/bin/bash
# ============================================
# SETUP CLOUDFLARE TUNNEL
# Jalankan SETELAH deploy-server.sh selesai
# ============================================

set -e

APP_PORT=3000

echo "========================================="
echo "  CLOUDFLARE TUNNEL SETUP"
echo "========================================="

# 1. Login Cloudflare
echo ""
echo "[1/3] Login Cloudflare..."
echo "Buka link yang muncul di browser PC kamu, lalu klik Authorize"
cloudflared tunnel login

# 2. Buat tunnel
echo ""
echo "[2/3] Buat tunnel..."
cloudflared tunnel create brand-shop
TUNNEL_ID=$(cloudflared tunnel list | grep brand-shop | awk '{print $1}')
echo "Tunnel ID: $TUNNEL_ID"

# 3. Jalankan tunnel
echo ""
echo "[3/3] Jalankan tunnel..."
echo ""
echo "========================================="
echo "  TUNNEL AKTIF!"
echo "========================================="
echo ""
echo "URL akses akan muncul di bawah."
echo "Bagikan URL ini ke teman kamu:"
echo ""

# Jalankan tunnel (akan menampilkan URL)
cloudflared tunnel --url http://localhost:$APP_PORT
