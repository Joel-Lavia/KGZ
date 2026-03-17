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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: passwordService,
  ) {}
  async create(
    registrationUserDto: RegistrationUserDto,
  ): Promise<ApiResponse<userPublicDataResponse>> {
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
            status: HttpStatus.CONFLICT,
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
            status: HttpStatus.CONFLICT,
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
            status: HttpStatus.CONFLICT,
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
      return {
        status: HttpStatus.CREATED,
        message: `Enregistrement réussi, bienvenue ${user.name} ${user.lastName}`,
        data: user,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Une erreur est survenue ${error.message}`,
      };
    }
  }

  async findAll(): Promise<ApiResponse<userPublicDataResponse[]>> {
    try {
      const allUsers = await this.userModel.find();
      return {
        status: HttpStatus.FOUND,
        message: 'Tous les utilisateurs trouvent avec succès.',
        data: allUsers,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Une erreur est survenue ${error.message}`,
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
