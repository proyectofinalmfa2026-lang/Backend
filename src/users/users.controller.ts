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
import { PremiumGuard } from '../auth/guards/premium.guard';
import { UpdatePremiumDto } from './dto/update-premium.dto';
import { Patch, Body } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from './enums/user-role.enum';

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

    @Get('premium-test')
@UseGuards(JwtAuthGuard, PremiumGuard)
@ApiBearerAuth()
premiumTest() {
  return {
    message: 'Bienvenido a CineSphere Premium',
  };
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

@Patch(':id/premium')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
updatePremium(
  @Param('id') id: string,
  @Body() updatePremiumDto: UpdatePremiumDto,
) {
  return this.usersService.updatePremium(
    Number(id),
    updatePremiumDto.isPremium,
  );
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

