import { config } from 'dotenv';

config();

const dbConfig = [
  {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: [ 'src/**/*.entity{.ts}', ],
  migrations: [ 'migrations/*.ts', ],
  cli: { migrationsDir: 'migrations', },
},
  {
    name: 'seed',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    entities: [ 'src/**/*.entity{.ts}', ],
    migrations: [ 'seeds/*.ts', ],
    cli: { 'migrationsDir': 'seeds', },
  },
];

export default dbConfig;
