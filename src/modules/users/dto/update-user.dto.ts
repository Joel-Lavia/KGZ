import { PartialType } from '@nestjs/mapped-types';
import { RegistrationUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(RegistrationUserDto) {}
