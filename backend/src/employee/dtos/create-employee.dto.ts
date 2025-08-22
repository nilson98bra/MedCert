import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { EmployeeStatus } from '../enum/employee-status.enum';
import { Transform } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthdayDate: Date;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  status: EmployeeStatus;
}
