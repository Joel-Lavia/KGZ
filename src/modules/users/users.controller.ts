import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrationUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/decorators/userConnected';
import { JwtAuthGuard } from 'src/core/guards/user.guard';
import { Roles } from 'src/core/decorators/role';
import { rolesUsers, userStatut } from 'src/core/enums/user.enum';
import { link } from 'fs';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/PublicPath';
import type { Response } from 'express';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('registration')
  async create(
    @Body() createUserDto: RegistrationUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const createUser = await this.usersService.create(createUserDto);
    //==========TOKEN==============================================
    response.cookie('token-auth', createUser.data?.acces_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
      domain: 'localhost',
    });
    //=============REFRESH TOKEN=================================
    response.cookie('refresh-token-auth', createUser.data?.refresh_token, {
      httpOnly: true,
      secure: false, // true en production
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // Plus long ! (Ex: expire après 7 jours)
      path: '/auth/refresh', // Optionnel: envoyé UNIQUEMENT à la route qui rafraîchit le token
      domain: 'localhost',
    });

    return createUser;
  }

  @Roles(rolesUsers.ADMIN, rolesUsers.SELLER, rolesUsers.USER)
  @Get('user')
  findOne(@User('sub') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Roles(rolesUsers.ADMIN, rolesUsers.SELLER, rolesUsers.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  //================ADMIN===============
  // @Roles(rolesUsers.ADMIN)
  @Delete('delete/:userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }
  // @Roles(rolesUsers.ADMIN)
  @Get('all')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.usersService.findAll(page, limit);
  }
  @Patch('block/:userId')
  blockUser(
    @Param('userId') userId: string,
    @Body('status') status: userStatut,
  ) {
    return this.usersService.blockUser(userId, status);
  }
}
