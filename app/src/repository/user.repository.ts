import { Injectable } from '@nestjs/common';
import { extend } from 'joi';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
