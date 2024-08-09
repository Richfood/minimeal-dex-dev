module.exports = {
  apps: [
    {
      name: process.env.APP_NAME,
      script: 'npm',
      args: 'start',
      cwd: process.env.APP_CWD,
      env: {
        PORT: process.env.PORT,
      },
      instances: 1,
      autorestart: true,
    }
  ]
};
