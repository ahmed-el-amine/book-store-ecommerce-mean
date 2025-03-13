module.exports = {
  apps: [
    {
      name: 'book-store-api',
      script: 'node_modules/.bin/nx',
      args: 'run node-api:serve --configuration=production',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'book-store-frontend',
      script: 'node_modules/.bin/nx',
      args: 'run angular:serve --configuration=production --poll=2000 --disable-host-check',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
