import { HttpStatus, Injectable } from '@nestjs/common';
import { RegistrationUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  userPublicDataResponse,
} from './schemas/user.schema';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/core/interfaces/apiResponse';
import { passwordService } from 'src/core/services/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { payloadUser } from 'src/core/interfaces/payload';
import dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: passwordService,
    private jwtService: JwtService,
  ) {}
  async create(registrationUserDto: RegistrationUserDto): Promise<
    ApiResponse<{
      acces_token: string;
      refresh_token: string;
    }>
  > {
    try {
      //===============PASSWORD=========================
      const password: string = await this.passwordService.hashPasseword(
        registrationUserDto.password,
      );
      //=============VERIFY USER EXIST====================
      let message: string = 'Un utilisateur existe déjà avec';

      if (registrationUserDto.email) {
        const emailExist = await this.userModel.exists({
          email: registrationUserDto.email,
        });

        if (emailExist) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: `${message} ${registrationUserDto.email}`,
          };
        }
      }

      if (registrationUserDto.telephone) {
        const phoneExist = await this.userModel.exists({
          telephone: registrationUserDto.telephone,
        });

        if (phoneExist) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: `${message} ${registrationUserDto.telephone}`,
          };
        }
      }
      if (registrationUserDto.userName) {
        const userNameExist = await this.userModel.exists({
          userName: registrationUserDto.userName,
        });

        if (userNameExist) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: `${message} ${registrationUserDto.userName}`,
          };
        }
      }
      //===================CREATE USER===================
      const user: UserDocument = await this.userModel.create({
        profilImage: registrationUserDto.profilImages,
        name: registrationUserDto.name,
        firstName: registrationUserDto.firstName,
        lastName: registrationUserDto.lastName,
        userName: registrationUserDto.userName,
        sexe: registrationUserDto.sexe,
        email: registrationUserDto.email,
        password: password,
        telephone: registrationUserDto.telephone,
      });
      //=============PAYLOAD=====================
      let payload: payloadUser = {
        sub: user.id,
        userName: user.userName,
        role: user.role ?? [],
        aud: registrationUserDto.audUser!,
        iss: process.env.API_URL!,
        status: user.status,
      };
      //=============GENERATION TOKEN============
      const [acces_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_TOKEN,
          expiresIn: '5d',
        }),
      ]);

      return {
        statusCode: HttpStatus.CREATED,
        message: `Enregistrement réussi, bienvenue ${user.name} ${user.lastName}`,
        data: {
          acces_token,
          refresh_token,
        },
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Une erreur est survenue ${error.message}`,
      };
    }
  }

  async findAll(): Promise<ApiResponse<userPublicDataResponse[]>> {
    try {
      const allUsers = await this.userModel.find();
      return {
        statusCode: HttpStatus.FOUND,
        message: 'Tous les utilisateurs trouvent avec succès.',
        data: allUsers,
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Une erreur est survenue ${error.message}`,
      };
    }
  }

  async findOne(
    userId: string,
  ): Promise<ApiResponse<userPublicDataResponse | null>> {
    try {
      const user = await this.userModel.findById(userId);
      return {
        statusCode: HttpStatus.FOUND,
        message: `Donnéé Utilisateur trouvées`,
        data: user,
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Une erreur est survenue ${error.message}`,
      };
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
