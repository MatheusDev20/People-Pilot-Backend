module.exports = config = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.MYSQ_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: process.env.DB_SYNC,
};
