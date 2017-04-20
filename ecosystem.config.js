module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Wattle',
      script    : './index.js',
      env: {
        PORT: 3000,
        MONGODB_URI: '',
        CLIENT_ID: '',
        CLIENT_SECRET: '',
        API_URL: 'https://api.wattle.io',
        WATTLE_URL: 'https://wattle.io',
        DEBUG: '',
        SECRET: ''
      },
      env_production : {
        NODE_ENV: 'production',
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : '',
      host : '',
      key  : '',
      ref  : '',
      repo : '',
      path : '',
      'post-deploy' : ''
    }
  }
}
