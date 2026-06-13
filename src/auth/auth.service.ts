import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthRepository } from './auth.repository';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
) {}

  async signup(signupDto: SignupDto) {
    const {
      username,
      email,
      password,
      confirmPassword,
    } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Las contraseñas no coinciden',
      );
    }

    const userByEmail =
      await this.authRepository.findUserByEmail(
        email,
      );

    if (userByEmail) {
      throw new BadRequestException(
        'El email ya está registrado',
      );
    }

    const userByUsername =
      await this.authRepository.findUserByUsername(
        username,
      );

    if (userByUsername) {
      throw new BadRequestException(
        'El nombre de usuario ya está registrado',
      );
    }

    const newUser =
      await this.authRepository.createUser(
        signupDto,
      );

    await this.notificationsService.create({
      title: 'Bienvenido a CineSphere',
      message:
        'Tu cuenta fue creada correctamente. Ya puedes comenzar a descubrir películas, publicar reseñas y conectar con otros usuarios.',
      userId: newUser.id,
    });

    const {
      password: userPassword,
      ...userWithoutPassword
    } = newUser;

    return {
      message: 'Usuario registrado correctamente',
      user: userWithoutPassword,
    };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.authRepository.findUserByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Usuario registrado solo con Google
    if (!user.password) {
      throw new UnauthorizedException(
        'Este usuario debe iniciar sesión con Google',
      );
    }

    // Comparar contraseña hasheada
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.generateJwt(user);

    const { password: userPassword, ...userWithoutPassword } = user;

    return {
      message: 'Login exitoso',
      token,
      user: userWithoutPassword,
    };
  }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    username: string;
    avatar?: string;
  }) {
    const { googleId, email, name, avatar } = googleUser;

    let user = await this.authRepository.findUserByGoogleId(googleId);

    if (user) {
      return user;
    }

    user = await this.authRepository.findUserByEmail(email);

    if (user) {
      user.googleId = googleId;

      if (avatar) {
        user.avatar = avatar;
      }

      return this.authRepository.saveUser(user);
    }

    const baseUsername = email.split('@')[0];

    let finalUsername = baseUsername;

    const userByUsername =
      await this.authRepository.findUserByUsername(finalUsername);

    if (userByUsername) {
      finalUsername = `${baseUsername}_${Date.now()}`;
    }

    const newUser = await this.authRepository.createGoogleUser({
      googleId,
      email,
      name,
      username: finalUsername,
      avatar,
    });

    return newUser;
  }

  async findUserById(id: number) {
    return await this.authRepository.findUserById(id);
  }

  async getProfileResponse(id: number) {
    const user = await this.authRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const avgRating =
      user.reviews && user.reviews.length > 0
        ? user.reviews.reduce((sum, r: any) => sum + (r.rating ?? 0), 0) /
        user.reviews.length
        : 0;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      favoriteGenres: [],
      badges: [],
      stats: {
        moviesWatched: user.watchlists?.length ?? 0,
        reviews: user.reviews?.length ?? 0,
        lists: 0,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    };
  }

  generateJwt(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}