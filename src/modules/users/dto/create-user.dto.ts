import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { sexeUsers } from 'src/core/enums/user.enum';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: "URL de l'image de profil de l'utilisateur",
    example: 'https://monsite.com/images/profile.jpg',
  })
  @IsString()
  @IsOptional()
  profilImages?: string;

  @ApiProperty({
    description: "Nom complet affiché de l'utilisateur",
    example: 'Joel Lavia',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Joel',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    description: 'Post-nom ou nom de famille',
    example: 'Lavia',
  })
  @IsString()
  @IsNotEmpty()
  LastName!: string;

  @ApiPropertyOptional({
    description: "Sexe de l'utilisateur",
    enum: sexeUsers,
    example: sexeUsers.FEMALE,
  })
  @IsOptional()
  @IsEnum(sexeUsers)
  sexe?: sexeUsers;

  @ApiPropertyOptional({
    description: "Adresse email de l'utilisateur",
    example: 'joel@example.com',
  })
  @IsEmail()
  @IsString()
  @IsOptional()
  email!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'StrongPassword123',
    minLength: 10,
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  password!: string;

  @ApiProperty({
    description: "Numéro de téléphone de l'utilisateur",
    example: '812345678',
    maxLength: 9,
  })
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  @MaxLength(9)
  telephone!: string;
}
