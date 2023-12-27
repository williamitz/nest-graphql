const path = require('path') // eslint-disable-line

const baseConfig = {
    type: process.env.DB_TYPE,
    database: process.env.DB_NAME,

    entities:  [ 'src/**/entities/*.entity{.ts,.js}' ],
    seeds:     [ 'src/common/seeds/**/*{.ts,.js}' ],
    factories: [ 'src/common/factories/**/*{.ts,.js}'  ],

    logger: 'advanced-console',
    logging: ['warn', 'error'],
  }
  
  if (process.env.APP_MODE !== 'prod') {
    module.exports = {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // synchronize: false,
      dropSchema: true,
      synchronize: true,
      ...baseConfig,
    }
  } else {
    module.exports = {
      dropSchema: true,
      synchronize: true,
      ...baseConfig,
    }
  }