import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Model } from 'mongoose';
import { payloadUser } from '../interfaces/payload';
import { JwtService } from '@nestjs/jwt';
import { passwordService } from '../services/password/password.service';
import { ApiResponse, responseLogin } from '../interfaces/apiResponse';
import { audAuth, rolesUsers } from '../enums/user.enum';
import dotenv from 'dotenv';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly passwordService: passwordService,
  ) {}
  async validateUser(
    userName: string,
    password: string,
    telephone: string,
  ): Promise<any> {
    try {
      const user = await this.userModel.findOne({
        $and: [
          { userName: userName },
          { password: password },
          { telephone: telephone },
        ],
      });
      if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error: any) {
      return { message: `Erreur lors de la connexion ${error.message}` };
    }
  }
  async login(loginDto: LoginAuthDto): Promise<ApiResponse<responseLogin>> {
    try {
      let audience;

      //===============VERIFY USER================
      const user = await this.userModel
        .findOne({
          $and: [
            { userName: loginDto.userName },
            { telephone: loginDto.telephone },
          ],
        })
        .select('password id userName role status');

      if (!user) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `Identifiant incorrect.`,
        };
      }
      //=================VALIDATE PASSWORD==============
      const validePassWord = await this.passwordService.verifyPassWord(
        user.password,
        loginDto.password,
      );
      if (!validePassWord) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `Mot de passe incorrecte.`,
        };
      }
      //================PAYLOAD===============
      if (
        user.role?.includes(rolesUsers.USER) ||
        user.role?.includes(rolesUsers.SELLER)
      ) {
        audience = [audAuth.MobileApp, audAuth.WebApp];
      } else if (user.role?.includes(rolesUsers.ADMIN)) {
        audience = audAuth.WepAppAdmin;
      }
      console.log('Status user ===>', user.status);

      let payload: payloadUser = {
        sub: user._id.toString(),
        userName: user.userName,
        role: user.role ?? [],
        aud: audience!,
        iss: process.env.API_URL!,
        status: user.status,
      };
      //==============GENERATION TOKEN============
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_TOKEN,
          expiresIn: '5d',
        }),
      ]);

      return {
        statusCode: HttpStatus.ACCEPTED,
        data: { user:payload ,access_token, refresh_token },
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Une erreur est survenu ${error.message}`,
      };
    }
  }

  create(createAuthDto: LoginAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
