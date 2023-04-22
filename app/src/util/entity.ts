import { Achievement } from '@entity/achievement.entity';
import { Block } from '@entity/block.entity';
import { Friend } from '@entity/friend.entity';
import { GameLog } from '@entity/game_log.entity';
import { User } from '@entity/user.entity';
import { UserAchievement } from '@entity/user_achievement';

const entities = [User, Friend, Block, GameLog, Achievement, UserAchievement];

export default entities;
