# Prop.ie Platform - Deployment Guide

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Deployment Architecture](#deployment-architecture)
4. [Environment Setup](#environment-setup)
5. [Docker Deployment](#docker-deployment)
6. [Manual Deployment](#manual-deployment)
7. [Database Configuration](#database-configuration)
8. [Environment Variables](#environment-variables)
9. [SSL Configuration](#ssl-configuration)
10. [Monitoring and Logging](#monitoring-and-logging)
11. [Backup and Recovery](#backup-and-recovery)
12. [Scaling Considerations](#scaling-considerations)
13. [Troubleshooting](#troubleshooting)

## Introduction

This deployment guide provides comprehensive instructions for deploying the Prop.ie property development platform in various environments. It covers both Docker-based deployment and manual deployment options, along with configuration details, security considerations, and maintenance procedures.

The guide is intended for system administrators and DevOps engineers responsible for deploying and maintaining the Prop.ie platform.

## System Requirements

### Minimum Hardware Requirements

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 100Mbps connection

### Recommended Hardware Requirements

- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: 1Gbps connection

### Software Requirements

- **Operating System**: Ubuntu 20.04 LTS or newer
- **Docker**: 20.10.x or newer
- **Docker Compose**: 2.x or newer
- **Node.js**: 16.x or newer (for manual deployment)
- **MongoDB**: 5.0 or newer (for manual deployment)
- **Nginx**: 1.18 or newer (for manual deployment)

## Deployment Architecture

The Prop.ie platform consists of three main components:

1. **Frontend**: Next.js application
2. **Backend**: Express.js API
3. **Database**: MongoDB

### Standard Deployment Architecture

```
                   ┌─────────────┐
                   │             │
                   │   Nginx     │
                   │   (Proxy)   │
                   │             │
                   └──────┬──────┘
                          │
                          ▼
         ┌────────────────┴───────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐             ┌─────────────────┐
│                 │             │                 │
│  Frontend       │             │  Backend        │
│  (Next.js)      │◄───────────►│  (Express)      │
│                 │             │                 │
└─────────────────┘             └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │                 │
                                │  MongoDB        │
                                │                 │
                                └─────────────────┘
```

### High-Availability Deployment Architecture

For production environments with high availability requirements:

```
                   ┌─────────────┐
                   │             │
                   │   Load      │
                   │   Balancer  │
                   │             │
                   └──────┬──────┘
                          │
                          ▼
         ┌────────────────┴───────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐             ┌─────────────────┐
│                 │             │                 │
│  Frontend       │             │  Frontend       │
│  Instance 1     │             │  Instance 2     │
│                 │             │                 │
└─────────────────┘             └─────────────────┘
         │                                │
         └────────────────┬───────────────┘
                          │
                          ▼
         ┌────────────────┴───────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐             ┌─────────────────┐
│                 │             │                 │
│  Backend        │             │  Backend        │
│  Instance 1     │             │  Instance 2     │
│                 │             │                 │
└─────────────────┘             └─────────────────┘
         │                                │
         └────────────────┬───────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │                 │
                 │  MongoDB        │
                 │  Replica Set    │
                 │                 │
                 └─────────────────┘
```

## Environment Setup

### Setting Up the Deployment Server

1. Update the system:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Docker:
```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce
```

3. Install Docker Compose:
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

4. Add your user to the Docker group:
```bash
sudo usermod -aG docker ${USER}
```

5. Create a directory for the application:
```bash
mkdir -p /opt/prop-ie
cd /opt/prop-ie
```

## Docker Deployment

### Deploying with Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/your-organization/prop-ie.git /opt/prop-ie
cd /opt/prop-ie
```

2. Configure environment variables:
```bash
cp frontend/.env.example frontend/.env.production
cp backend/.env.example backend/.env.production
# Edit the environment files with your configuration
```

3. Build and start the containers:
```bash
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up -d
```

4. Verify the deployment:
```bash
docker-compose -f docker/docker-compose.yml ps
```

### Using the Deployment Script

Alternatively, you can use the provided deployment script:

1. Make the script executable:
```bash
chmod +x deploy.sh
```

2. Run the deployment script:
```bash
./deploy.sh production
```

### Updating the Application

To update the application to a new version:

1. Pull the latest changes:
```bash
git pull origin main
```

2. Rebuild and restart the containers:
```bash
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up -d
```

## Manual Deployment

### Frontend Deployment

1. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Clone the repository:
```bash
git clone https://github.com/your-organization/prop-ie.git /opt/prop-ie
cd /opt/prop-ie/frontend
```

3. Install dependencies:
```bash
npm ci
```

4. Configure environment variables:
```bash
cp .env.example .env.production
# Edit .env.production with your configuration
```

5. Build the application:
```bash
npm run build
```

6. Start the application:
```bash
npm start
```

7. For production, set up a process manager:
```bash
sudo npm install -g pm2
pm2 start npm --name "prop-ie-frontend" -- start
pm2 save
pm2 startup
```

### Backend Deployment

1. Clone the repository (if not already done):
```bash
cd /opt/prop-ie/backend
```

2. Install dependencies:
```bash
npm ci
```

3. Configure environment variables:
```bash
cp .env.example .env.production
# Edit .env.production with your configuration
```

4. Build the application:
```bash
npm run build
```

5. Start the application with PM2:
```bash
pm2 start dist/server.js --name "prop-ie-backend"
pm2 save
```

### Nginx Configuration

1. Install Nginx:
```bash
sudo apt install -y nginx
```

2. Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/prop-ie
```

3. Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/prop-ie /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Database Configuration

### MongoDB Setup

1. Install MongoDB (if not using Docker):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

2. Create a database and user:
```bash
mongosh
```

```javascript
use prop-ie
db.createUser({
  user: "propie_user",
  pwd: "your_secure_password",
  roles: [{ role: "readWrite", db: "prop-ie" }]
})
exit
```

3. Enable authentication:
```bash
sudo nano /etc/mongod.conf
```

Add or modify the security section:
```yaml
security:
  authorization: enabled
```

4. Restart MongoDB:
```bash
sudo systemctl restart mongod
```

### Database Backup

Set up a daily backup script:

1. Create a backup script:
```bash
sudo nano /opt/prop-ie/backup.sh
```

2. Add the following content:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/prop-ie/backups"
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --uri="mongodb://propie_user:your_secure_password@localhost:27017/prop-ie" --out="$BACKUP_DIR/mongodb_$TIMESTAMP"

# Compress the backup
tar -czf "$BACKUP_DIR/mongodb_$TIMESTAMP.tar.gz" "$BACKUP_DIR/mongodb_$TIMESTAMP"
rm -rf "$BACKUP_DIR/mongodb_$TIMESTAMP"

# Keep only the last 7 backups
ls -tp $BACKUP_DIR/*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}
```

3. Make the script executable:
```bash
sudo chmod +x /opt/prop-ie/backup.sh
```

4. Add a cron job:
```bash
sudo crontab -e
```

Add the following line to run the backup daily at 2 AM:
```
0 2 * * * /opt/prop-ie/backup.sh
```

## Environment Variables

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://api.prop.ie |
| NEXT_PUBLIC_SOCKET_URL | WebSocket server URL | http://api.prop.ie |
| NEXT_PUBLIC_AUTH_DOMAIN | Authentication domain | auth.prop.ie |
| NEXT_PUBLIC_AUTH_CLIENT_ID | Auth client ID | your_client_id |
| NEXT_PUBLIC_ENABLE_CHAT | Enable chat feature | true |
| NEXT_PUBLIC_ANALYTICS_ID | Analytics ID | UA-XXXXXXXX-X |

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |
| MONGODB_URI | MongoDB connection string | mongodb://user:pass@host:port/db |
| JWT_SECRET | JWT signing secret | your_jwt_secret |
| JWT_EXPIRATION | JWT expiration time | 7d |
| FRONTEND_URL | Frontend URL | https://prop.ie |
| SMTP_HOST | SMTP server host | smtp.example.com |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | SMTP username | notifications@prop.ie |
| SMTP_PASS | SMTP password | your_smtp_password |
| LOG_LEVEL | Logging level | info |

## SSL Configuration

### Obtaining SSL Certificates with Let's Encrypt

1. Install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. Obtain certificates:
```bash
sudo certbot --nginx -d your-domain.com
```

3. Verify automatic renewal:
```bash
sudo certbot renew --dry-run
```

### Manual SSL Configuration

If you're not using Let's Encrypt, you can manually configure SSL:

1. Update your Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Rest of your configuration...
}
```

## Monitoring and Logging

### Setting Up Logging

1. Configure application logging in the backend:
```javascript
// In your backend configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

2. Set up log rotation:
```bash
sudo apt install -y logrotate
sudo nano /etc/logrotate.d/prop-ie
```

Add the following configuration:
```
/opt/prop-ie/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        [ -s /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

### Monitoring with Prometheus and Grafana (Optional)

1. Install Prometheus:
```bash
sudo apt install -y prometheus prometheus-node-exporter
```

2. Configure Prometheus:
```bash
sudo nano /etc/prometheus/prometheus.yml
```

Add your targets:
```yaml
scrape_configs:
  - job_name: 'prop-ie'
    static_configs:
      - targets: ['localhost:5000']
```

3. Install Grafana:
```bash
sudo apt-get install -y apt-transport-https software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y grafana
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

4. Access Grafana at http://your-server-ip:3000 and configure Prometheus as a data source.

## Backup and Recovery

### Backup Strategy

1. **Database Backups**: Daily MongoDB dumps (configured earlier)
2. **File Backups**: Regular backups of uploaded files
3. **Configuration Backups**: Backup of all environment files and configurations

### Setting Up File Backups

1. Create a backup script for files:
```bash
sudo nano /opt/prop-ie/file-backup.sh
```

2. Add the following content:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/prop-ie/backups"
mkdir -p $BACKUP_DIR

# Backup uploaded files
tar -czf "$BACKUP_DIR/files_$TIMESTAMP.tar.gz" /opt/prop-ie/backend/uploads

# Backup environment files
tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" /opt/prop-ie/frontend/.env.production /opt/prop-ie/backend/.env.production

# Keep only the last 7 backups
ls -tp $BACKUP_DIR/files_*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}
ls -tp $BACKUP_DIR/config_*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}
```

3. Make the script executable:
```bash
sudo chmod +x /opt/prop-ie/file-backup.sh
```

4. Add a cron job:
```bash
sudo crontab -e
```

Add the following line to run the backup weekly:
```
0 3 * * 0 /opt/prop-ie/file-backup.sh
```

### Recovery Procedures

#### Database Recovery

1. Extract the backup:
```bash
tar -xzf /opt/prop-ie/backups/mongodb_YYYYMMDD_HHMMSS.tar.gz -C /tmp/
```

2. Restore the database:
```bash
mongorestore --uri="mongodb://propie_user:your_secure_password@localhost:27017/prop-ie" --drop /tmp/mongodb_YYYYMMDD_HHMMSS/prop-ie
```

#### File Recovery

1. Extract the file backup:
```bash
tar -xzf /opt/prop-ie/backups/files_YYYYMMDD_HHMMSS.tar.gz -C /tmp/
```

2. Copy the files back:
```bash
cp -r /tmp/opt/prop-ie/backend/uploads/* /opt/prop-ie/backend/uploads/
```

## Scaling Considerations

### Horizontal Scaling

For high-traffic environments, consider:

1. **Load Balancing**: Deploy multiple frontend and backend instances behind a load balancer
2. **Database Scaling**: Set up MongoDB replica sets for redundancy and read scaling
3. **Caching**: Implement Redis for caching frequently accessed data

### Vertical Scaling

For moderate traffic growth:

1. **Increase Resources**: Allocate more CPU and RAM to existing servers
2. **Optimize Database**: Add indexes and optimize queries
3. **Application Tuning**: Optimize code and implement caching

### Cloud Deployment

For cloud environments:

1. **Containerization**: Use Kubernetes for orchestration
2. **Managed Services**: Consider using managed MongoDB services
3. **CDN**: Implement a CDN for static assets
4. **Auto-scaling**: Configure auto-scaling based on traffic patterns

## Troubleshooting

### Common Issues

#### Application Not Starting

1. Check logs:
```bash
docker-compose -f docker/docker-compose.yml logs
# or for manual deployment
pm2 logs
```

2. Verify environment variables:
```bash
cat frontend/.env.production
cat backend/.env.production
```

3. Check disk space:
```bash
df -h
```

#### Database Connection Issues

1. Verify MongoDB is running:
```bash
sudo systemctl status mongod
# or for Docker
docker-compose -f docker/docker-compose.yml ps
```

2. Check connection string:
```bash
mongosh "mongodb://propie_user:your_secure_password@localhost:27017/prop-ie"
```

#### Performance Issues

1. Check system resources:
```bash
top
```

2. Monitor application performance:
```bash
pm2 monit
```

3. Check database performance:
```bash
mongosh --eval "db.currentOp()"
```

### Support Resources

For additional support:

- **Documentation**: Refer to the developer documentation
- **GitHub Issues**: Check for known issues in the repository
- **Support Email**: Contact support@prop.ie for assistance

---

This deployment guide is maintained by the Prop.ie operations team. For questions or clarifications, please contact the technical team.
