import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'user',
  password: 'userpassword',
  database: 'sampledb',
  entities: [],
  synchronize: true,
};

export default config;
