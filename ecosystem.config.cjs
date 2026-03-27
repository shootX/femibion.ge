require('dotenv').config({ path: '/www/wwwroot/femibion.ge/.env' })

module.exports = {
  apps: [{
    name: 'femibion',
    cwd: '/www/wwwroot/femibion.ge',
    script: 'node_modules/.bin/next',
    args: 'start',
    interpreter: '/usr/local/bin/node',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      PWD: '/www/wwwroot/femibion.ge',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_FROM: process.env.SMTP_FROM,
    },
    instances: 1,
    autorestart: true,
    watch: false,
  }],
};
