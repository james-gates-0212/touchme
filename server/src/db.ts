import { getConfig } from './config';
import { Sequelize } from 'sequelize';
import * as pg from 'pg';

const highlight = require('cli-highlight').highlight;

const config = getConfig();

const sequelize = new Sequelize(config.database.db, config.database.user, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: config.database.ssl && {
      ssl: true,
      rejectUnauthorized: false,
      ca: config.database.ssl_cert,
    },
  },
  logging: config.database.logging
    ? (log) =>
        console.log(
          highlight(log, {
            language: 'sql',
            ignoreIllegals: true,
          }),
        )
    : false,
});

export default sequelize;
