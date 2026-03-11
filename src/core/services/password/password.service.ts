import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class passwordService {
  async hashPasseword(password: string): Promise<string> {
    try {
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: Number(process.env.ARGON_MEMORYCOST),
        parallelism: Number(process.env.ARGON_PARALLELISM),
        timeCost: Number(process.env.ARGON_TIMECOAST),
        hashLength: Number(process.env.ARGON_HASHLENG),
        secret: Buffer.from(process.env.ARGON_SECRET!),
      });
      console.log(`Mot de passe hache ===>${hash}`);

      return hash;
    } catch (error: any) {
      return `Une erreur est survenu: ${error.message}`;
    }
  }
  async verifyPassWord(hashPasseword, inputPassword): Promise<boolean> {
    try {
      const verifyPassword = await argon2.verify(hashPasseword, inputPassword, {
        secret: Buffer.from(process.env.ARGON_SECRET!),
      });
      return verifyPassword;
    } catch (error: any) {
      return false;
    }
  }
}
