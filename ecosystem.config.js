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
        MONGODB_URI: 'mongodb://wattleuser:1JJ2123jdsflj23@52.38.10.113:27017/wattle_db',
        CLIENT_ID: '461555961018-875vq6kd1l5hg0oncvqptpfuf1epqvbk.apps.googleusercontent.com',
        CLIENT_SECRET: '5DRfiQA8SY00ZyLWnG9cob9G'
      },
      env_production : {
        NODE_ENV: 'production',
        PRODUCTION: 'true'
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'ec2-user',
      host : 'ec2-52-11-133-170.us-west-2.compute.amazonaws.com',
      key  : '~/.aws/wattle-be.pem',
      ref  : 'origin/master',
      repo : 'git@github.com:grello-project/grello-backend.git',
      path : '/home/ec2-user/grello-backend',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
