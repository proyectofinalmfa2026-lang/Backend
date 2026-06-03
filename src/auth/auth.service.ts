import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  signup(signupDto: SignupDto) {
    const { name, username, email, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    return {
      message: 'Usuario registrado correctamente',
      user: {
        name,
        username,
        email,
      },
    };
  }

  signin(signinDto: SigninDto) {
    const { email } = signinDto;

    return {
      message: 'Login exitoso',
      email,
    };
  }
}
