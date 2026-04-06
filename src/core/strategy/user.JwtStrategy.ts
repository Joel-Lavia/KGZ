import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import dotenv from 'dotenv';
import { audAuth, rolesUsers } from '../enums/user.enum';
import { payloadUser } from '../interfaces/payload';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Model } from 'mongoose';

dotenv.config();

@Injectable()
export class userJwtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
      audience: [audAuth.MobileApp, audAuth.WebApp, audAuth.WepAppAdmin],
    });
  }

  async validate(payload: payloadUser) {
    try {
      let audience;
      const user = await this.userModel
        .findById(payload.sub, 'userName role')
        .lean()
        .exec();
      console.log('User ===>', user);

      if (
        user!.role?.includes(rolesUsers.USER) ||
        user!.role?.includes(rolesUsers.SELLER)
      ) {
        audience = [audAuth.MobileApp, audAuth.WebApp];
      } else if (user!.role?.includes(rolesUsers.ADMIN)) {
        audience = audAuth.WepAppAdmin;
      }

      if (!user || user === null) {
        throw new UnauthorizedException(`Utlisateur n'existe pas`);
      }
      if (payload.aud === audAuth.WepAppAdmin) {
        throw new UnauthorizedException();
      }
      return {
        sub: user.id,
        role: user.role,
        userName: user.userName,
        aud: audience,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Une erreur est survenue ${error.message}`,
      );
    }
  }
}
