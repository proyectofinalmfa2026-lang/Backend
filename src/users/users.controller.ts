import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

@Post('avatar')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
async uploadAvatar(
  @UploadedFile() file: any,
  @Req() req: any,
) {
  const result =
    await this.cloudinaryService.uploadImage(
      file,
    );

  const updatedUser =
    await this.usersService.updateAvatar(
      req.user.id,
      (result as any).secure_url,
    );

  return {
    message: 'Avatar actualizado correctamente',
    avatar: (result as any).secure_url,
    user: updatedUser,
  };
}

}
