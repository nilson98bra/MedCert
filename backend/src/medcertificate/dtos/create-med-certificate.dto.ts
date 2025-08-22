import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreateMedCertificateDto {
  @IsString()
  @IsNotEmpty()
  idEmployee: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsInt()
  @Min(1)
  @Max(365)
  daysAway: number;

  @IsString()
  @IsDateString()
  medicalCertificateDate: string;

  @IsString()
  @IsNotEmpty()
  cid: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  observation?: string;
}
