import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedCertificateEntity,
  MedCertificateSchema,
} from './entities/medcertificate.entity';
import { MedCertificateService } from './services/med-certificate.service';
import { MedCertificateController } from './controllers/med-certificate.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MedCertificateRepository } from './repositories/med-certificate.repository';
import { CidRepository } from './repositories/cid.repository';
import { IcdModule } from 'src/icd/icd.module';
import { CidEntity, CidSchema } from './entities/cid.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedCertificateEntity.name, schema: MedCertificateSchema },
      { name: CidEntity.name, schema: CidSchema },
    ]),
    AuthModule,
    IcdModule,
  ],
  providers: [
    {
      provide: 'IMedCertificateRepository',
      useClass: MedCertificateRepository,
    },
    {
      provide: 'ICidRepository',
      useClass: CidRepository,
    },
    {
      provide: 'IMedCertificateService',
      useClass: MedCertificateService,
    },
    IcdModule,
  ],
  controllers: [MedCertificateController],
})
export class MedCertificateModule {}
