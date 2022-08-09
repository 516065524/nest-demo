const productConfig = {
  mysql: {
    port: 3306,
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'nest_zero_to_one',
    connectionLimit: 10,
  },
};

const localConfig = {
  mysql: {
    port: 3306,
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'nest_zero_to_one',
    connectionLimit: 10,
  },
};

const config = process.env.NODE_ENV ? productConfig : localConfig;

export default config;
