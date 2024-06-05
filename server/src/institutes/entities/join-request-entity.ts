import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { JoinRequestStatus } from 'src/Types/institute.types';

export type JoinRequestDocument = JoinRequest & Document;

@Schema({ timestamps: true })
export class JoinRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  member: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true,
  })
  institute: Types.ObjectId;

  @Prop({ type: String, enum: JoinRequestStatus, required: false })
  status: JoinRequestStatus;
}

export const JoinRequestSchema = SchemaFactory.createForClass(JoinRequest);
