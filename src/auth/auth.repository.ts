import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/users.entity';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findUserByEmailWithPassword(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        googleId: true,
        avatar: true,
        bio: true,
        role: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUserByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }

  async findUserByGoogleId(googleId: string) {
    return await this.usersRepository.findOne({
      where: { googleId },
    });
  }

  async createUser(signupDto: SignupDto) {
    const { name, username, email, password } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      isPremium: false,
    });

    return await this.usersRepository.save(newUser);
  }

  async createGoogleUser(googleUserData: {
    googleId: string;
    email: string;
    name: string;
    username: string;
    avatar?: string;
  }) {
    const { googleId, email, name, username, avatar } = googleUserData;

    const newUser = this.usersRepository.create({
      googleId,
      email,
      name,
      username,
      avatar,
      password: null,
      role: UserRole.USER,
      isPremium: false,
    });

    return await this.usersRepository.save(newUser);
  }

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }
}