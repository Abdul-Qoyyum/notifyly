import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(query: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOne({ where: query });
  }
}
