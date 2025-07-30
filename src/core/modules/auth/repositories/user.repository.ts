import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from '../entities/user_auths.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  async getUser(query: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOne({ where: query });
  }

  async getUserAuth(
    query: FindOptionsWhere<UserAuth>,
  ): Promise<UserAuth | null> {
    return this.userAuthRepository.findOne({ where: query });
  }
}
