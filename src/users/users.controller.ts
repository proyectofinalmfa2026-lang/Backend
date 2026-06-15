import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
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

  @Get('profile/:username')
getPublicProfile(@Param('username') username: string) {
  return this.usersService.getPublicProfile(username);
}

  @Get(':id/profile')
getProfile(
  @Param('id') id: string,
) {
  return this.usersService.getProfile(
    Number(id),
  );
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    console.log('ENTRO A AVATAR');
    console.log(req.user);

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

