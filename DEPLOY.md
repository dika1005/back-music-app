# Deployment Guide - Music API

## Prerequisites

Di VPS kamu perlu install:
- **Bun** - JavaScript runtime
- **MariaDB/MySQL** - Database
- **PM2** - Process manager
- **Nginx** - Reverse proxy (optional, untuk domain)

---

## 1. Setup VPS

### Install Bun
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### Install PM2
```bash
bun add -g pm2
```

### Install MariaDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mariadb-server
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE music_app;
CREATE USER 'music_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON music_app.* TO 'music_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 2. Clone & Setup Project

```bash
# Clone repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/app-music.git
cd app-music

# Install dependencies
bun install

# Setup environment
cp .env.example .env
nano .env  # Edit sesuai konfigurasi VPS
```

### Contoh .env untuk Production
```env
DATABASE_URL="mysql://music_user:your_password@localhost:3306/music_app"
PORT=3000
NODE_ENV=production

BETTER_AUTH_SECRET=generate_random_32_char_string_here
BETTER_AUTH_URL=https://yourdomain.com

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JIOSAAVN_API_URL=https://saavn.dev/api
```

### Setup Database
```bash
bunx prisma db push
```

---

## 3. Run with PM2

```bash
# Start app
pm2 start ecosystem.config.cjs --env production

# Save PM2 config (auto-start on reboot)
pm2 save
pm2 startup
```

### PM2 Commands
```bash
pm2 status          # Check status
pm2 logs music-api  # View logs
pm2 restart music-api  # Restart
pm2 stop music-api  # Stop
```

---

## 4. Setup Nginx (untuk Domain)

### Install Nginx
```bash
sudo apt install nginx
```

### Create config
```bash
sudo nano /etc/nginx/sites-available/music-api
```

```nginx
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable site
```bash
sudo ln -s /etc/nginx/sites-available/music-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. SSL Certificate (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 6. Auto-Deploy dari GitHub (Optional)

### Buat script deploy
```bash
nano /var/www/app-music/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/app-music
git pull origin main
bun install
bunx prisma db push
pm2 restart music-api
```

```bash
chmod +x deploy.sh
```

### Setup Webhook atau jalankan manual:
```bash
./deploy.sh
```

---

## Update Google OAuth

Jangan lupa update di Google Cloud Console:
- **Authorized redirect URIs**: `https://yourdomain.com/api/auth/callback/google`

---

## Troubleshooting

### Check logs
```bash
pm2 logs music-api --lines 100
```

### Check if port is in use
```bash
sudo lsof -i :3000
```

### Restart everything
```bash
pm2 restart all
sudo systemctl restart nginx
```
