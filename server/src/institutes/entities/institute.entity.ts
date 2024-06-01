import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as crypto from 'crypto';
import { IsOptional, IsUrl } from 'class-validator';

export type InstituteDocument = Institute & Document;

class Location {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;
}

@Schema({ timestamps: true })
export class Institute {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  @IsUrl()
  avatar: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({
    required: false,
    default: () => crypto.randomBytes(16).toString('hex'),
  })
  secret: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @IsOptional()
  account: Types.ObjectId;
  @IsOptional()
  _id?: unknown;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
