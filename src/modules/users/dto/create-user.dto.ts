import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { audAuth, passWordlenth, sexeUsers } from 'src/core/enums/user.enum';

export class RegistrationUserDto {
  @ApiPropertyOptional({
    description: "URL de l'image de profil de l'utilisateur",
    example: 'https://monsite.com/images/profile.jpg',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === null ? undefined : value))
  profilImages?: string;

  @ApiProperty({
    description: "Nom complet affiché de l'utilisateur",
    example: 'Joel Lavia',
  })
  @IsString({ message: `Le nom est obligatoire` })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Joel',
  })
  @IsString({ message: `Le Prenom` })
  @IsOptional()
  firstName!: string;

  @ApiProperty({
    description: 'Post-nom ou nom de famille',
    example: 'Lavia',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'Nom utilisateur',
    example: 'Kindkey87',
  })
  @IsString({ message: `UserName est obligatoire` })
  userName?: string;

  @ApiPropertyOptional({
    description: "Sexe de l'utilisateur",
    enum: sexeUsers,
    example: sexeUsers.FEMALE,
  })
  @IsOptional()
  @IsEnum(sexeUsers, { message: 'Sexe invalide' })
  sexe?: sexeUsers;

  @ApiPropertyOptional({
    description: "Adresse email de l'utilisateur",
    example: 'joel@example.com',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsString()
  @IsOptional()
  email!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'StrongPassword123',
    minLength: passWordlenth.MinLength,
    maxLength: passWordlenth.MaxLength,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(passWordlenth.MinLength, {
    message: `Le mot de passe doit avoir une longeur Minimale de ${passWordlenth.MinLength} caracteres `,
  })
  @MaxLength(passWordlenth.MaxLength, {
    message: `Le mot de passe doit avoir une longeur Maximale de ${passWordlenth.MaxLength} caracteres`,
  })
  password!: string;

  @ApiProperty({
    description: "Numéro de téléphone de l'utilisateur",
    example: '+243812345678',
    maxLength: 13,
  })
  @IsPhoneNumber(undefined, {
    message: `Le numéro doit être au format international (ex: +243...)`,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(13)
  telephone!: string;

  @IsOptional()
  @IsEnum(audAuth)
  audUser?: audAuth;
}
