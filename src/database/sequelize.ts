import { Sequelize } from 'sequelize-typescript';
import db from '../../config/db';

const sequelize = new Sequelize(
  db.mysql.database,
  db.mysql.user,
  db.mysql.password || null,
  {
    host: db.mysql.host,
    port: db.mysql.port,
    dialect: 'mysql',
    pool: {
      max: db.mysql.connectionLimit,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: '+08:00',
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((err: any) => {
    console.error(err);
    throw err;
  });

export default sequelize;
