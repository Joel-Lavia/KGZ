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
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('registration')
  create(@Body() createUserDto: RegistrationUserDto) {
    return this.usersService.create(createUserDto);
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
