module.exports = {
  apps: [
    {
      name: 'neurodesk',
      script: 'npx',
      args: 'serve . -l 3000 --no-clipboard',
      cwd: '/home/user/webapp',
      env: { PORT: 3000 },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
