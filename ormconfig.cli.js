const { configFactory } = require('./src/config');

const baseConfig = configFactory();
module.exports = {
  ...baseConfig.typeorm,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  seeds: ['src/database/seeds/**/*.ts'],
  factories: ['src/database/factories/**/*.ts'],
  logging: false,
  // indicates the files that typeorm must load migrations from
  migrations: ['src/migration/*.ts'],
  cli: {
    // indicates the directory that the CLI must create new migrations in
    migrationsDir: 'src/migration',
  },
};
