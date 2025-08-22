import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EmployeeStatus } from '../enum/employee-status.enum';

@Schema({ timestamps: true })
export class EmployeeEntity {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, select: true })
  cpf: string;

  @Prop({ required: true, select: true })
  birthdayDate: Date;

  @Prop({ required: true, select: true })
  role: string;

  @Prop({ required: true, select: true })
  idUser: string;

  @Prop({ required: true, select: true })
  status: EmployeeStatus;
}

export const EmployeSchema = SchemaFactory.createForClass(EmployeeEntity);
