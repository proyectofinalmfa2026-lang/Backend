import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follower } from './entities/followers.entity';
import { User } from '../users/entities/users.entity';

import { CreateFollowerDto } from './dto/create-follower.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowersService {

constructor(
  @InjectRepository(Follower)
  private readonly followerRepository: Repository<Follower>,

  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  private readonly notificationsService: NotificationsService,
) {}


  async create(
    createFollowerDto: CreateFollowerDto,
  ) {
    const follower =
      await this.userRepository.findOne({
        where: {
          id: createFollowerDto.followerId,
        },
      });

    if (!follower) {
      throw new NotFoundException(
        'Follower user not found',
      );
    }

    const following =
      await this.userRepository.findOne({
        where: {
          id: createFollowerDto.followingId,
        },
      });

    if (!following) {
      throw new NotFoundException(
        'Following user not found',
      );
    }

    if (follower.id === following.id) {
      return {
        following: false,
        message:
          'No puedes seguirte a ti mismo',
      };
    }

    const existingFollow =
      await this.followerRepository.findOne({
        where: {
          follower: {
            id: follower.id,
          },
          following: {
            id: following.id,
          },
        },
        relations: {
          follower: true,
          following: true,
        },
      });

    if (existingFollow) {
      await this.followerRepository.remove(
        existingFollow,
      );

      return {
        following: false,
        message: 'Usuario dejado de seguir',
      };
    }

    const newFollow = new Follower();

    newFollow.follower = follower;
    newFollow.following = following;

    const savedFollow =
      await this.followerRepository.save(
        newFollow,
      );
          
    if (follower.id !== following.id) {
      await this.notificationsService.create({
        title: 'Nuevo seguidor',
        message: `${follower.username} comenzó a seguirte`,
        userId: following.id,
      });
    }

    return {
      following: true,
      message: 'Usuario seguido',
      follow: savedFollow,
    };
  }

  findAll() {
    return this.followerRepository.find({
      relations: {
        follower: true,
        following: true,
      },
    });
  }

  findOne(id: string) {
    return this.followerRepository.findOne({
      where: { id },
      relations: {
        follower: true,
        following: true,
      },
    });
  }

  async getFollowers(userId: number) {
    return this.followerRepository.find({
      where: {
        following: {
          id: userId,
        },
      },
      relations: {
        follower: true,
      },
    });
  }

  async getFollowing(userId: number) {
    return this.followerRepository.find({
      where: {
        follower: {
          id: userId,
        },
      },
      relations: {
        following: true,
      },
    });
  }

  remove(id: string) {
    return this.followerRepository.delete(id);
  }
}
