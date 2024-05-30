import { ClsStore } from 'nestjs-cls';

export interface MinimalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AppClsStore extends ClsStore {
  'x-request-id': string;
  user: MinimalUser;
}

export interface MinimalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export enum UserStatus {
  Verified = 'VERIFIED',
  Unverified = 'UNVERIFIED',
  google_Auth = 'GOOGLE_AUTH',
}

export enum UserStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  INITIATE = 'INITIATE',
  GOOGLE_AUTH = 'GOOGLE_AUTH',
}

export enum UserType {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  INSTITUTE = 'INSTITUTE',
}

export enum FoundFrom {
  FACEBOOK = 'FACEBOOK',
  FROM_A_FRIEND = 'FROM_A_FRIEND',
  INSTAGRAM = 'INSTAGRAM',
  WHATSAPP = 'WHATSAPP',
  INSTITUTE = 'INSTITUTE',
  OTHER = 'OTHER',
}
