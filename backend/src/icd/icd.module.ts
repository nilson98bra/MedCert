import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IcdAuthService } from './icd-auth.service';
import { IcdService } from './icd.service';

@Module({
  imports: [HttpModule],
  providers: [IcdAuthService, IcdService],
  exports: [IcdService],
})
export class IcdModule {}
