import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';

export type InstituteDocument = Institute & Document;

class Location {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;
}

@Schema()
export class Institute {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({
    required: false,
    default: () => crypto.randomBytes(16).toString('hex'),
  })
  secret: string;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);
