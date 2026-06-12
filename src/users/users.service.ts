import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

async updateAvatar(
  userId: number,
  avatarUrl: string,
) {
  const user =
    await this.usersRepository.findOne({
      where: { id: userId },
    });

  if (!user) {
    throw new Error('User not found');
  }

  user.avatar = avatarUrl;

  return this.usersRepository.save(user);
}

}