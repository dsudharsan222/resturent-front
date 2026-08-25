module.exports = {
  apps: [
    {
      name: "resturant-app",
      script: "npm",
      args: "run preview -- --host=0.0.0.0 --port=5173",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
