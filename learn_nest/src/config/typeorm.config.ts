import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'seunpark',
  password: '',
  database: 'test_nest',
  entities: [User],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
};
