import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilService {
  constructor(private readonly jwtService: JwtService) {}

  parseTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/#\{([^}]+)\}/g, (match, key) => {
      return data.hasOwnProperty(key) ? data[key] : match;
    });
  }

  async hashPassword(pwd: string) {
    const salt = await genSalt();
    return hash(pwd, salt);
  }

  async comparePassword(hashedPwd: string, pwd: string) {
    return compare(pwd, hashedPwd);
  }

  createToken(data: { user_id: string; [key: string]: any }) {
    return this.jwtService.signAsync(data);
  }
}
