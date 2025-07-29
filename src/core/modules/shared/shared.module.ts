import { Global, Module } from '@nestjs/common';
import { UtilService } from './services/utils.service';

@Global()
@Module({
  providers: [UtilService],
  exports: [UtilService],
})
export class SharedModule {}
