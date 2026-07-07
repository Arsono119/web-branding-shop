#!/bin/bash
# ============================================
# DEPLOY BRAND-SHOP KE UBUNTU SERVER
# Jalankan script ini di laptop Ubuntu server
# ============================================

set -e

REPO_URL="https://github.com/Arsono119/web-branding-shop.git"
DEPLOY_DIR="/root/brand-shop"
APP_PORT=3000

echo "========================================="
echo "  DEPLOY BRAND-SHOP E-COMMERCE"
echo "========================================="

# 1. Install Node.js (jika belum ada)
echo ""
echo "[1/8] Cek & Install Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js belum terinstall, menginstall..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
echo "Node.js: $(node -v)"
echo "NPM: $(npm -v)"

# 2. Install PM2
echo ""
echo "[2/8] Install PM2..."
npm install -g pm2

# 3. Clone repo
echo ""
echo "[3/8] Clone repository..."
if [ -d "$DEPLOY_DIR" ]; then
    echo "Directory sudah ada, git pull..."
    cd "$DEPLOY_DIR"
    git pull origin main
else
    git clone "$REPO_URL" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# 4. Install dependencies
echo ""
echo "[4/8] Install dependencies..."
npm install

# 5. Build
echo ""
echo "[5/8] Build production..."
npm run build

# 6. Buat .env.local
echo ""
echo "[6/8] Buat .env.local..."
cat > .env.local << 'EOF'
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXTAUTH_SECRET=brand-shop-secret-$(date +%s)
NEXTAUTH_URL=http://localhost:3000
EOF
echo ".env.local created!"

# 7. Start dengan PM2
echo ""
echo "[7/8] Start aplikasi dengan PM2..."
pm2 delete brand-shop 2>/dev/null || true
pm2 start npm --name "brand-shop" -- start -- -p $APP_PORT
pm2 save

# Auto-start saat reboot
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "========================================="
echo "  APLIKASI BERJALAN DI PORT $APP_PORT"
echo "  Test: curl http://localhost:$APP_PORT"
echo "========================================="

# 8. Install Cloudflare Tunnel
echo ""
echo "[8/8] Install Cloudflare Tunnel..."
if ! command -v cloudflared &> /dev/null; then
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
    chmod +x /usr/local/bin/cloudflared
fi
echo "cloudflared: $(cloudflared --version)"

echo ""
echo "========================================="
echo "  SETUP SELESAI!"
echo "========================================="
echo ""
echo "Langkah selanjutnya:"
echo "  1. Buka browser di PC kamu"
echo "  2. Jalankan: cloudflared tunnel login"
echo "  3. Ikuti link yang muncul untuk login Cloudflare"
echo "  4. Jalankan: cloudflared tunnel create brand-shop"
echo "  5. Jalankan: cloudflared tunnel --url http://localhost:$APP_PORT"
echo ""
echo "  Atau jalankan script tunnel: ./deploy-tunnel.sh"
echo "========================================="
