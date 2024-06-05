import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { Institute } from './entities/institute.entity';
import { StatusUpdateDto } from './dto/status.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { UsersService } from 'src/users/users.service';
import mongoose from 'mongoose';
import { JoinRequest } from './entities/join-request-entity';
import { CreateJoinRequestDto } from './dto/join-request-institute.dto';
import { JoinRequestStatus } from 'src/Types/institute.types';

@ApiTags('institutes')
@Controller({ path: 'institutes', version: '1' })
export class InstitutesController {
  constructor(
    private readonly institutesService: InstitutesService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create institute' })
  @ApiResponse({
    status: 201,
    description: 'The institute has been successfully created.',
    type: Institute,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.institutesService.create(createInstituteDto);
  }

  @Post('join')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'join request institute' })
  @ApiResponse({
    status: 201,
    description: 'The institute has been successfully created.',
    type: JoinRequest,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async join(@Body() createJoinRequestDto: CreateJoinRequestDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.MEMBER) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    if (user.institute != null || user.institute != undefined) {
      throw new HttpException(
        'User already joined to institute',
        HttpStatus.BAD_REQUEST,
      );
    }
    const institute = await this.institutesService.findOne({
      _id: createJoinRequestDto.institute,
    });
    if (!institute) {
      throw new HttpException('Institute not found!', HttpStatus.NOT_FOUND);
    }
    const request = await this.institutesService.joinRequestFindOne({
      member: context.user.id,
      institute: createJoinRequestDto.institute,
    });
    if (request) {
      throw new HttpException(
        'User already in this institute',
        HttpStatus.UNAUTHORIZED,
      );
    }

    createJoinRequestDto.member = new mongoose.Types.ObjectId(context.user.id);
    createJoinRequestDto.status = JoinRequestStatus.PENDING;

    return this.institutesService.join(createJoinRequestDto, user, institute);
  }

  @Patch('status/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update status of the institute' })
  @ApiResponse({
    status: 201,
    description: 'The status has been Updated successfully.',
    type: Institute,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async statusUpdate(
    @Param('id') id: string,
    @Body() statusUpdateDto: StatusUpdateDto,
  ) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.ADMIN) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Institute Id!', HttpStatus.BAD_REQUEST);
    }
    const institute = await this.institutesService.findOne({ _id: id });
    if (!institute) {
      throw new HttpException('Institute not found!', HttpStatus.NOT_FOUND);
    }

    return this.institutesService.statusUpdate(
      institute.account,
      statusUpdateDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all institutes' })
  @ApiResponse({
    status: 200,
    description: 'Return all institutes.',
    type: [Institute],
  })
  findAll() {
    return this.institutesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get institute by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the institute with the given ID.',
    type: Institute,
  })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  findOne(@Param('id') id: string) {
    return this.institutesService.findOne(id);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update institute' })
  @ApiResponse({
    status: 200,
    description: 'The institute has been successfully updated.',
    type: Institute,
  })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  async update(@Body() updateInstituteDto: UpdateInstituteDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user || user.type != UserType.INSTITUTE) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }

    const institute = await this.institutesService.findOne({
      account: user._id,
    });
    if (!institute) {
      throw new HttpException('Institute not found!', HttpStatus.NOT_FOUND);
    }

    return this.institutesService.update(institute._id, updateInstituteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete institute by ID' })
  @ApiResponse({
    status: 200,
    description: 'The institute has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  remove(@Param('id') id: string) {
    return this.institutesService.remove(id);
  }
}
