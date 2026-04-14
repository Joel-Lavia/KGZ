import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrationUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/decorators/userConnected';
import { JwtAuthGuard } from 'src/core/guards/user.guard';
import { Roles } from 'src/core/decorators/role';
import { rolesUsers } from 'src/core/enums/user.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }
}
