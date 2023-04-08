import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Friend } from 'src/entity/friend.entity';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  findUser(userId : number) : Promise<User | null> {

    const query = this.createQueryBuilder('users')
    .where('users.id =  :userId', {userId: userId})
    .getOne();
    return query;
    // const query2 = this.createQueryBuilder('users')
    //   .leftJoinAndSelect(Friend, 'friends', 'friends.sourceId = users.id')
    //   .leftJoinAndSelect(Friend, 'friends2', 'friends2.targetId = users.id')
    //   .where('users.id =  :userId', {userId: userId})
    //   .select([
    //     'users.id',
    //     'users.name',
    //     'users.nickname',
    //     'users.twoFactor',
    //     // 'course.siteUrl AS course_siteUrl',
    //     // `DATE_FORMAT(course.createdAt, '%Y-%m-%d at %h:%i') AS course_createdAt`,
    //     // 'instructor.id',
    //     // 'instructor.name',
    //     // 'IFNULL(review.num_review,0) AS num_review',
    //     // 'IFNULL(review.avg,0) AS course_avg',
    //     'friends',
    //     'friends2',
    //   ])
    //   .getRawOne();

    // return query2;
  }
}
