import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserAuth } from './entities/user_auths.entity';
import { Role } from './entities/role.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/core/constants';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuth, Role]),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
