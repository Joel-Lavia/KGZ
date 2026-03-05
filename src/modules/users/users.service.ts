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

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(
    registrationUserDto: RegistrationUserDto,
  ): Promise<ApiResponse<userPublicDataResponse>> {
    try {
      const user = await this.userModel.create({
        profilImage: registrationUserDto.profilImages,
        name: registrationUserDto.name,
        firstName: registrationUserDto.firstName,
        lastName: registrationUserDto.lastName,
        sexe: registrationUserDto.sexe,
        email: registrationUserDto.email,
        password: registrationUserDto.password,
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

  async findAll():Promise<ApiResponse<userPublicDataResponse[]>> {
   try {
     const allUsers = await this.userModel.find();
     return {
       status: HttpStatus.FOUND,
       message: 'Tous les utilisateurs trouvent avec succès.',
       data: allUsers,
     };
   } catch (error:any) {
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
