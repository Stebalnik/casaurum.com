module.exports = {
  apps: [
    {
      name: "casaurum-web",
      cwd: "/var/www/casaurum.com",
      script: "server.mjs",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "4888",
        SITE_HOST: "casaurum.com",
        NEXT_PUBLIC_SITE_URL: "https://casaurum.com",
        NEXT_PUBLIC_GA_ID: "G-VMNKJG2M5R",
        CONTACT_TO_EMAIL: "teodorleo622@gmail.com"
      }
    },
    {
      name: "casaurum-lead-bot",
      cwd: "/var/www/casaurum.com",
      script: "bot.mjs",
      interpreter: "node",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        TELEGRAM_BOT_TOKEN: "",
        TELEGRAM_CHAT_ID: "",
        CRM_DB_PATH: "/var/www/casaurum.com/data/casaurum-crm.sqlite",
        BOT_POLL_INTERVAL_MS: "15000",
        BOT_REMINDER_AFTER_MINUTES: "60",
        BOT_ESCALATE_AFTER_HOURS: "24"
      }
    }
  ]
};
