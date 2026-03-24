import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passWordlenth } from 'src/core/enums/user.enum';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Nom utilisateur',
    example: 'Kindkey87',
  })
  @IsString()
  @IsNotEmpty()
  userName!: string;

  @ApiProperty({
    description: "Numéro de téléphone de l'utilisateur",
    example: '+243812345678',
    maxLength: 13,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  telephone!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'StrongPassword123',
    minLength: passWordlenth.MinLength,
    maxLength: passWordlenth.MaxLength,
  })
  @IsNotEmpty()
  @MinLength(passWordlenth.MinLength)
  @MaxLength(passWordlenth.MaxLength)
  password!: string;
}
