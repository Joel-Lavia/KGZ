import {
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginAuthDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  telephone!: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  password!: string;
}
