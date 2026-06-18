import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPremiumDto } from './dto/update-user-premium.dto';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
getUsers() {
  return this.adminService.getAllUsers();
}

@Patch('users/:id/role')
updateUserRole(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateUserRoleDto: UpdateUserRoleDto,
) {
  return this.adminService.updateUserRole(
    id,
    updateUserRoleDto,
  );
}

@Patch('users/:id/premium')
updateUserPremium(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateUserPremiumDto: UpdateUserPremiumDto,
) {
  return this.adminService.updateUserPremium(
    id,
    updateUserPremiumDto,
  );
}

@Get('reviews')
getReviews() {
  return this.adminService.getAllReviews();
}

@Delete('reviews/:id')
deleteReview(
  @Param('id') id: string,
) {
  return this.adminService.deleteReview(id);
}

@Get('comments')
getComments() {
  return this.adminService.getAllComments();
}

@Delete('comments/:id')
deleteComment(
  @Param('id') id: string,
) {
  return this.adminService.deleteComment(id);
}
}