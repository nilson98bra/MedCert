import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class MedCertificateEntity {
  _id: Types.ObjectId;

  @Prop({ required: true })
  idEmployee: string;
  @Prop({ required: true })
  employeeName: string;

  @Prop({
    required: true,
    type: Number,
    validate: {
      validator: function (value: number) {
        return Number.isInteger(value) && value >= 1 && value <= 365;
      },
      message: 'Days away must be an integer between 1 and 365',
    },
  })
  daysAway: number;

  @Prop({
    required: true,
    type: String,
    match: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    validate: {
      validator: (value: string) => {
        return !isNaN(Date.parse(value));
      },
      message: 'Invalid date format',
    },
  })
  medicalCertificateDate: string;

  @Prop({ required: true, select: true })
  idUser: string;

  @Prop({ required: true, select: true })
  cid: string;

  @Prop({ required: true, select: true })
  description: string;

  @Prop({ required: false, select: true })
  observation: string;
}

export const MedCertificateSchema =
  SchemaFactory.createForClass(MedCertificateEntity);
