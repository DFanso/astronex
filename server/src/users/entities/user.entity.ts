import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsUrl } from 'class-validator';
import mongoose, { Document, Types } from 'mongoose';
import {
  UserStatus,
  UserType,
  FoundFrom,
  UserAuthType,
} from 'src/Types/user.types';

export type UserDocument = User & Document;

class Location {
  @Prop({ required: false })
  country: string;

  @Prop({ required: false })
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

  @Prop({ type: Location, required: false })
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

  @Prop({ required: false, unique: true })
  @IsOptional()
  cognitoUserId: string;

  @Prop({ required: false })
  @IsOptional()
  userAuthType: UserAuthType;
}

export const UserSchema = SchemaFactory.createForClass(User);
