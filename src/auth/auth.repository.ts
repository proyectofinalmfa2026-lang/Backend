import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/users.entity';
import { SignupDto } from './dto/signup.dto';

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

  async findUserByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }

  async createUser(signupDto: SignupDto) {
    const { name, username, email, password } = signupDto;

    const newUser = this.usersRepository.create({
      name,
      username,
      email,
      password,
    });

    return await this.usersRepository.save(newUser);
  }
}