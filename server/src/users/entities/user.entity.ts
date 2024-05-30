import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsUrl } from 'class-validator';
import mongoose, { Document, Types } from 'mongoose';
import { UserStatus, UserType, FoundFrom } from 'src/Types/user.types';

export type UserDocument = User & Document;

class Location {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  @IsUrl()
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.UNVERIFIED })
  status: UserStatus;

  @Prop({ type: String, enum: UserType, default: UserType.MEMBER })
  type: UserType;

  @Prop({ type: Location, required: true })
  @IsOptional()
  location: Location;

  @Prop()
  @IsOptional()
  birthday: Date;

  @Prop()
  @IsOptional()
  phoneNumber: string;

  @Prop({ type: String, enum: FoundFrom })
  @IsOptional()
  foundFrom: FoundFrom;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Institute' })
  @IsOptional()
  institute: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
