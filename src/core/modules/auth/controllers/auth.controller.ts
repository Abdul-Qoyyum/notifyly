import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dtos';
import { AuthService } from '../services/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CoreController from '../../../http/controllers/core.controller';
import { IsPublic } from '../decorators';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController extends CoreController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @IsPublic()
  @Post('login')
  async login(@Body() payload: LoginDto) {
    try {
      const response = await this.authService.login(payload);
      return this.successResponse('Login successfully', response);
    } catch (error) {
      return this.exceptionResponse(error);
    }
  }
}
