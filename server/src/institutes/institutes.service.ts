import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { Institute, InstituteDocument } from './entities/institute.entity';
import * as crypto from 'crypto';
import { CognitoService } from 'src/auth/CognitoService';
import { UserAuthType, UserStatus, UserType } from 'src/Types/user.types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { StatusUpdateDto } from './dto/status.update.dto';
import {
  JoinRequest,
  JoinRequestDocument,
} from './entities/join-request-entity';
import { CreateJoinRequestDto } from './dto/join-request-institute.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectModel(Institute.name)
    private instituteModel: Model<InstituteDocument>,
    @InjectModel(JoinRequest.name)
    private joinRequestModel: Model<JoinRequestDocument>,
    private readonly cognitoService: CognitoService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createInstituteDto: CreateInstituteDto,
  ): Promise<{ institute: Institute; user: User }> {
    try {
      const createUserDto: CreateUserDto = {
        firstName: createInstituteDto.name,
        lastName: createInstituteDto.name,
        avatar: createInstituteDto.avatar,
        email: createInstituteDto.email,
        password: createInstituteDto.password,
        userAuthType: UserAuthType.COGNITO,
        status: UserStatus.INACTIVE,
        type: UserType.INSTITUTE,
      };

      const user = await this.cognitoService.registerUser(createUserDto);

      createInstituteDto.account = user._id;

      const secret = crypto.randomBytes(16).toString('hex');
      const createdInstitute = new this.instituteModel({
        ...createInstituteDto,
        secret,
      });

      const savedInstitute = await createdInstitute.save();

      return { institute: savedInstitute, user };
    } catch (error) {
      if (error instanceof CognitoService) {
        throw new BadRequestException(error);
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid institute data');
      } else if (error.name === 'UsernameExistsException') {
        throw new HttpException('user already exits!', HttpStatus.CONFLICT);
      } else {
        console.error('Failed to create institute:', error);
        throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async join(
    createJoinRequestDto: CreateJoinRequestDto,
    user: User,
    institute: Institute,
  ): Promise<JoinRequest> {
    const joinRequest =
      await this.joinRequestModel.create(createJoinRequestDto);

    const emailHtml = await this.emailService.renderTemplate(
      'join-request.hbs',
      {
        memberName: `${user.firstName} ${user.lastName}`,
        instituteName: institute.name,
        status: createJoinRequestDto.status,
        avatar: user.avatar,
      },
    );

    await this.emailService.sendEmail(
      [user.email],
      `Your Join Request to ${institute.name} Institute`,
      emailHtml,
    );

    return joinRequest;
  }

  async findAll(): Promise<Institute[]> {
    return this.instituteModel.find().exec();
  }

  async findOne(filter: any): Promise<InstituteDocument | null> {
    return this.instituteModel
      .findOne(filter)
      .populate({
        path: 'account',
      })
      .exec();
  }

  async joinRequestFindOne(filter: any): Promise<JoinRequestDocument | null> {
    return this.joinRequestModel.findOne(filter).exec();
  }

  async update(
    id: any,
    updateInstituteDto: UpdateInstituteDto,
  ): Promise<Institute> {
    const updatedInstitute = await this.instituteModel
      .findByIdAndUpdate(id, updateInstituteDto, { new: true })
      .exec();
    if (!updatedInstitute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }
    return updatedInstitute;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.instituteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { deleted: true, id };
  }

  async statusUpdate(
    account: any,
    statusUpdateDto: StatusUpdateDto,
  ): Promise<User> {
    const user = await this.usersService.findOne({ _id: account });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    if (user.status == (statusUpdateDto.Status as string)) {
      throw new HttpException(
        `Institute already ${statusUpdateDto.Status}!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    user.status = statusUpdateDto.Status as unknown as UserStatus;

    return user.save();
  }
}
