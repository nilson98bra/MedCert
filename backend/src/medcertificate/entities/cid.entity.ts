import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CidEntity extends Document {
  @Prop({ required: true, select: true })
  cid: string;

  @Prop({
    required: true,
    minlength: 5,
    maxlength: 500,
  })
  description: string;

  @Prop({
    required: true,
    type: String,
  })
  idUser: string;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30,
  })
  expiresAt: Date;
}

export const CidSchema = SchemaFactory.createForClass(CidEntity);

CidSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
