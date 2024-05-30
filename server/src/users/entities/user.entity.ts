import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus, UserType, FoundFrom } from 'src/Types/user.types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.UNVERIFIED })
  status: UserStatus;

  @Prop({ type: String, enum: UserType, default: UserType.MEMBER })
  type: UserType;

  @Prop({ type: [String] })
  location: [string, string];

  @Prop()
  birthday: Date;

  @Prop()
  phoneNumber: string;

  @Prop({ type: String, enum: FoundFrom })
  foundFrom: FoundFrom;

  @Prop()
  institute: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
