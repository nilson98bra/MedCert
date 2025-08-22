import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeRepository } from './repositories/employe.mongo.repository';
import { EmployeeService } from './services/employee.service';
import { EmployeeEntity, EmployeSchema } from './entities/employee.entity';
import { EmployeeController } from './controllers/employee.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeEntity.name, schema: EmployeSchema },
    ]),
    AuthModule,
  ],
  controllers: [EmployeeController],
  providers: [
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
    {
      provide: 'IEmployeeService',
      useClass: EmployeeService,
    },
  ],
})
export class EmployeeModule {}
