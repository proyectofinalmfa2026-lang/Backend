import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(signupDto: SignupDto) {
    const { name, username, email, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const userByEmail = await this.authRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new BadRequestException('El email ya está registrado');
    }

    const userByUsername =
      await this.authRepository.findUserByUsername(username);

    if (userByUsername) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    const newUser = await this.authRepository.createUser(signupDto);

    const { password: userPassword, ...userWithoutPassword } = newUser;

    return {
      message: 'Usuario registrado correctamente',
      user: userWithoutPassword,
    };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    return {
      message: 'Login exitoso',
      user: userWithoutPassword,
    };
  }
}