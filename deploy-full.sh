#!/bin/bash
# ============================================
# FULL DEPLOY - SEMUA DALAM 1 SCRIPT
# Copy & paste ke laptop Ubuntu server lalu jalankan
# ============================================

set -e

REPO_URL="https://github.com/Arsono119/web-branding-shop.git"
DEPLOY_DIR="/root/brand-shop"
APP_PORT=3000

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║    BRAND-SHOP FULL DEPLOY             ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# 1. Install Node.js
echo "📦 [1/7] Install Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
fi
echo "    Node.js $(node -v) ✓"

# 2. Install PM2
echo "📦 [2/7] Install PM2..."
npm install -g pm2 > /dev/null 2>&1
echo "    PM2 ready ✓"

# 3. Clone & Install
echo "📦 [3/7] Clone & Install..."
if [ -d "$DEPLOY_DIR" ]; then
    cd "$DEPLOY_DIR"
    git pull origin main > /dev/null 2>&1
else
    git clone "$REPO_URL" "$DEPLOY_DIR" > /dev/null 2>&1
    cd "$DEPLOY_DIR"
fi
npm install > /dev/null 2>&1
echo "    Dependencies ready ✓"

# 4. Build
echo "📦 [4/7] Build production..."
npm run build > /dev/null 2>&1
echo "    Build success ✓"

# 5. .env.local
echo "📦 [5/7] Setup .env.local..."
SECRET=$(head -c 32 /dev/urandom | base64)
cat > .env.local << EOF
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXTAUTH_SECRET=$SECRET
NEXTAUTH_URL=http://localhost:$APP_PORT
EOF
echo "    .env.local ready ✓"

# 6. PM2 Start
echo "📦 [6/7] Start dengan PM2..."
pm2 delete brand-shop 2>/dev/null || true
pm2 start npm --name "brand-shop" -- start -- -p $APP_PORT > /dev/null 2>&1
pm2 save > /dev/null 2>&1
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true
echo "    App running on port $APP_PORT ✓"

# 7. Install cloudflared
echo "📦 [7/7] Install Cloudflare Tunnel..."
if ! command -v cloudflared &> /dev/null; then
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared > /dev/null 2>&1
    chmod +x /usr/local/bin/cloudflared
fi
echo "    cloudflared ready ✓"

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║    ✅ DEPLOY SELESAI!                 ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Cek lokal: curl http://localhost:$APP_PORT"
echo ""
echo "=== SETUP TUNNEL (untuk akses dari luar) ==="
echo ""
echo "Jalankan perintah ini 1 per 1:"
echo ""
echo "  cloudflared tunnel login"
echo "  # → Buka link di browser, login Cloudflare, authorize"
echo ""
echo "  cloudflared tunnel create brand-shop"
echo "  # → Catat Tunnel ID yang muncul"
echo ""
echo "  cloudflared tunnel --url http://localhost:$APP_PORT"
echo "  # → URL .trycloudflare.com akan muncul"
echo "  # → Bagikan URL ini ke teman!"
echo ""
echo "========================================="
