import AchievementRepository from 'src/repository/achievement.repository';
import BlockRepository from 'src/repository/block.repository';
import FriendRepository from 'src/repository/friend.repository';
import GameLogRepository from 'src/repository/game_log.repository';
import UserRepository from 'src/repository/user.repository';
import UserAchievementRepository from 'src/repository/user_achievement.repository';

const repositories = [
  UserRepository,
  FriendRepository,
  BlockRepository,
  GameLogRepository,
  AchievementRepository,
  UserAchievementRepository,
];

export default repositories;
