import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PREMIUM_AVATARS, FREE_AVATARS } from './constants/avatars';

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

  private sanitizeUser(user: any) {
    if (!user) return user;

    const {
      password,
      googleId,
      ...safeUser
    } = user;

    return safeUser;
  }

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

    return {
      message: 'Usuario registrado correctamente',
      user: this.sanitizeUser(newUser),
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

    return {
      message: 'Login exitoso',
      token,
      user: this.sanitizeUser(user),
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
      return this.sanitizeUser(user);
    }

    user = await this.authRepository.findUserByEmail(email);

    if (user) {
      user.googleId = googleId;

      if (avatar) {
        user.avatar = avatar;
      }

      return this.sanitizeUser(await this.authRepository.saveUser(user));
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

    return this.sanitizeUser(newUser);
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
      favoriteGenres: user.favoriteGenres ?? [],
      badges: user.badges ?? [],
      stats: {
        moviesWatched: user.watchlists?.length ?? 0,
        reviews: user.reviews?.length ?? 0,
        lists: 0,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    };
  }

  async updateProfile(
    id: number,
    data: {
      avatar?: string | null;
      favoriteGenres?: string[];
      badges?: {
        id: string;
        label: string;
        color: 'gold' | 'blue' | 'green' | 'purple' | 'rose' | 'cyan';
        icon: string;
        requiredTier?: 'free' | 'premium';
      }[];
    },
  ) {
    const user = await this.authRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    if (data.avatar !== undefined) {
      if (data.avatar === null) {
        user.avatar = null;
      } else if (data.avatar.startsWith('http')) {
        user.avatar = data.avatar;
      } else {
        const availableAvatars = [
          ...FREE_AVATARS,
          ...PREMIUM_AVATARS,
        ];

        if (!availableAvatars.includes(data.avatar)) {
          throw new BadRequestException(
            'Avatar inválido',
          );
        }

        if (
          PREMIUM_AVATARS.includes(data.avatar) &&
          !user.isPremium
        ) {
          throw new ForbiddenException(
            'Este avatar requiere una suscripción Premium',
          );
        }

        user.avatar = data.avatar;
      }
    }

    if (data.favoriteGenres !== undefined) {
      user.favoriteGenres = data.favoriteGenres;
    }

    if (data.badges !== undefined) {
      user.badges = data.badges;
    }

    return this.sanitizeUser(
      await this.authRepository.saveUser(user),
    );
  }

  generateJwt(user: any) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium,
  };

  return this.jwtService.sign(payload);
}

  }
