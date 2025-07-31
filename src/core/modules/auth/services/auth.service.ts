import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { LoginDto } from '../dtos';
import { UserRepository } from '../repositories/user.repository';
import { UtilService } from '../../shared/services/utils.service';
import { ACCESS_TOKEN_EXPIRES } from '../../../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly utilService: UtilService,
  ) {}

  async login(payload: LoginDto) {
    const { email, password } = payload;
    const user = await this.userRepository.getUser({ email });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const userAuth = await this.userRepository.getUserAuth({
      user_id: user.id,
    });

    if (!userAuth) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await this.utilService.comparePassword(
      userAuth.password_hash,
      password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = await this.utilService.createToken({
      user_id: user.id,
      exp: moment()
        .utc()
        .add({ seconds: Number(ACCESS_TOKEN_EXPIRES) })
        .unix(),
    });

    return {
      user,
      meta: {
        access_token: accessToken,
      },
    };
  }
}
