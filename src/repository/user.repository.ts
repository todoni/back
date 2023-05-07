import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from '@entity/user.entity';
import { UserAccessDto } from '@dto/user/user.dto';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUser(userId: number): Promise<User | null> {
    const query = await this.createQueryBuilder('users')
      .where('users.id = :userId', { userId: userId })
      .getOne();
    return query;
  }

  async findUserAllDetail(userId: number): Promise<User | null> {
    return await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.friends', 'friends')
      .leftJoinAndSelect('users.blocks', 'blocks')
      .where('users.id = :userId', { userId: userId })
      .getOne();
  }

  async findUserByName(name: string): Promise<User | null> {
    const query = await this.createQueryBuilder('users')
      .where('users.name = :username', { username: name })
      .getOne();
    return query;
  }

  async findUserByNickname(name: string): Promise<User | null> {
    const query = await this.createQueryBuilder('users')
      .where('users.nickname = :nickname', { nickname: name })
      .getOne();
    return query;
  }

  async updateFirstAccess(user: User) {
    await this.createQueryBuilder('users')
      .update(user)
      .where('users.id = :id', { id: user.id })
      .execute();
  }

  async updateDisplayName(userId: number, name: string) {
    await this.createQueryBuilder('users')
      .update()
      .set({ nickname: name })
      .where('users.id = :id', { id: userId })
      .execute();
  }

  async updateImageUrl(userId: number, imageUrl: string) {
    await this.createQueryBuilder('users')
      .update()
      .set({ profile: imageUrl })
      .where('users.id = :userId', { userId: userId })
      .execute();
  }

  async updateTwoFactor(userId: number, twoFactor: string) {
    await this.createQueryBuilder('users')
      .update()
      .set({ twoFactor: twoFactor })
      .where('users.id = :userId', { userId: userId })
      .execute();
  }
}
